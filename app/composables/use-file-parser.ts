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
   * Unified file parser that handles both required and optional files
   */
  async function parseFile<T>(
    file: File | undefined,
    fileName: string,
    defaultValue?: T,
  ): Promise<T> {
    if (!file) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Required file ${fileName} is missing`);
    }

    try {
      return await parseJsonFile<T>(file);
    }
    catch (e) {
      throw new Error(`Failed to parse ${fileName}: ${e instanceof Error ? e.message : 'Invalid JSON format'}`);
    }
  }

  /**
   * Validates that a property exists (if required) and is an array
   */
  function validateArrayProperty(
    value: unknown,
    property: string,
    fileName: string,
    required: boolean,
  ): void {
    if (required && !value) {
      throw new Error(`Invalid ${fileName}: missing "${property}" property`);
    }

    if (value && !Array.isArray(value)) {
      throw new Error(`Invalid ${fileName}: "${property}" must be an array`);
    }
  }

  /**
   * Parse all uploaded files and return structured data
   */
  async function parseAllFiles(files: UploadedFiles): Promise<ParsedThreadsData> {
    if (!files.threadsAndReplies) {
      throw new Error('lack of required files for parsing: threads_and_replies.json is required');
    }

    // Parse all files in parallel
    const [threadsData, followersData, followingData, likesData, savedData] = await Promise.all([
      parseFile<ThreadsAndRepliesResponse>(
        files.threadsAndReplies,
        'threads_and_replies.json',
      ),
      parseFile<ThreadFollowersResponse>(
        files.followers,
        'followers.json',
        { text_post_app_text_post_app_followers: [] },
      ),
      parseFile<ThreadFollowingResponse>(
        files.following,
        'following.json',
        { text_post_app_text_post_app_following: [] },
      ),
      parseFile<ThreadLikesResponse>(
        files.likedThreads,
        'liked_threads.json',
        { text_post_app_media_likes: [] },
      ),
      parseFile<ThreadSavedPostsResponse>(
        files.savedThreads,
        'saved_threads.json',
        { text_post_app_text_post_app_saved_posts: [] },
      ),
    ]);

    // Validate data structures using a configuration array
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
        required: true,
      },
      {
        value: followingData.text_post_app_text_post_app_following,
        property: 'text_post_app_text_post_app_following',
        fileName: 'following.json',
        required: true,
      },
      {
        value: likesData.text_post_app_media_likes,
        property: 'text_post_app_media_likes',
        fileName: 'liked_threads.json',
        required: true,
      },
      {
        value: savedData.text_post_app_text_post_app_saved_posts,
        property: 'text_post_app_text_post_app_saved_posts',
        fileName: 'saved_threads.json',
        required: false,
      },
    ];

    // Validate all properties in a loop
    validations.forEach(({ value, property, fileName, required }) => {
      validateArrayProperty(value, property, fileName, required);
    });

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
