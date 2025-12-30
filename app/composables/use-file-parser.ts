import type {
  UploadedFiles,
  ParsedThreadsData,
  ThreadsAndRepliesResponse,
  ThreadFollowersResponse,
  ThreadFollowingResponse,
  ThreadLikesResponse,
  ThreadSavedPostsResponse,
} from '~/types/threads';
import { parseJsonFile } from '~/utils/file-upload';
import { completeSingleMedia } from '~/utils/complete-single-media';

/**
 * Composable for parsing uploaded Threads data files
 */
export function useFileParser() {
  /**
   * Helper to parse a required file with context-aware error messages
   */
  async function parseRequiredFile<T>(file: File, fileName: string): Promise<T> {
    try {
      return await parseJsonFile<T>(file);
    }
    catch (e) {
      throw new Error(`Failed to parse ${fileName}: ${e instanceof Error ? e.message : 'Invalid JSON format'}`);
    }
  }

  /**
   * Helper to parse an optional file with context-aware error messages
   */
  async function parseOptionalFile<T>(
    file: File | undefined,
    fileName: string,
    defaultValue: T,
  ): Promise<T> {
    if (!file) return defaultValue;

    try {
      return await parseJsonFile<T>(file);
    }
    catch (e) {
      throw new Error(`Failed to parse ${fileName}: ${e instanceof Error ? e.message : 'Invalid JSON format'}`);
    }
  }

  /**
   * Parse all uploaded files and return structured data
   */
  async function parseAllFiles(files: UploadedFiles): Promise<ParsedThreadsData> {
    if (!files.threadsAndReplies) {
      throw new Error('lack of required files for parsing: threads_and_replies.json is required');
    }

    // Parse all files in parallel with better error context
    const [threadsData, followersData, followingData, likesData, savedData] = await Promise.all([
      parseRequiredFile<ThreadsAndRepliesResponse>(
        files.threadsAndReplies,
        'threads_and_replies.json',
      ),
      parseOptionalFile<ThreadFollowersResponse>(
        files.followers,
        'followers.json',
        { text_post_app_text_post_app_followers: [] },
      ),
      parseOptionalFile<ThreadFollowingResponse>(
        files.following,
        'following.json',
        { text_post_app_text_post_app_following: [] },
      ),
      parseOptionalFile<ThreadLikesResponse>(
        files.likedThreads,
        'liked_threads.json',
        { text_post_app_media_likes: [] },
      ),
      parseOptionalFile<ThreadSavedPostsResponse>(
        files.savedThreads,
        'saved_threads.json',
        { text_post_app_text_post_app_saved_posts: [] },
      ),
    ]);

    // Validate data structures using a loop
    const validations = [
      {
        value: threadsData.text_post_app_text_posts,
        property: 'text_post_app_text_posts',
        fileName: 'threads_and_replies.json',
        required: true,
      },
      {
        value: followersData.text_post_app_text_post_app_followers,
        property: 'text_post_app_text_post_app_followers',
        fileName: 'followers.json',
        required: false,
      },
      {
        value: followingData.text_post_app_text_post_app_following,
        property: 'text_post_app_text_post_app_following',
        fileName: 'following.json',
        required: false,
      },
      {
        value: likesData.text_post_app_media_likes,
        property: 'text_post_app_media_likes',
        fileName: 'liked_threads.json',
        required: false,
      },
      {
        value: savedData.text_post_app_text_post_app_saved_posts,
        property: 'text_post_app_text_post_app_saved_posts',
        fileName: 'saved_threads.json',
        required: false,
      },
    ];

    for (const { value, property, fileName, required } of validations) {
      if (required && !value) {
        throw new Error(`Invalid ${fileName}: missing "${property}" property`);
      }

      if (value && !Array.isArray(value)) {
        throw new Error(`Invalid ${fileName}: "${property}" must be an array`);
      }
    }

    // Validate posts structure before mapping
    try {
      return {
        posts: threadsData.text_post_app_text_posts.map(completeSingleMedia),
        followers: followersData.text_post_app_text_post_app_followers || [],
        following: followingData.text_post_app_text_post_app_following || [],
        likes: likesData.text_post_app_media_likes || [],
        savedPosts: savedData.text_post_app_text_post_app_saved_posts || [],
      };
    }
    catch (e) {
      throw new Error(`Failed to process posts data: ${e instanceof Error ? e.message : 'Invalid post structure'}`);
    }
  }

  return { parseAllFiles };
}
