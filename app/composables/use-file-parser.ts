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
   * Parse all uploaded files and return structured data
   */
  async function parseAllFiles(files: UploadedFiles): Promise<ParsedThreadsData> {
    if (!files.threadsAndReplies) {
      throw new Error('缺少討論串資料檔案');
    }

    const [threadsData, followersData, followingData, likesData, savedData] = await Promise.all([
      parseJsonFile<ThreadsAndRepliesResponse>(files.threadsAndReplies),
      files.followers
        ? parseJsonFile<ThreadFollowersResponse>(files.followers)
        : Promise.resolve({ text_post_app_text_post_app_followers: [] }),
      files.following
        ? parseJsonFile<ThreadFollowingResponse>(files.following)
        : Promise.resolve({ text_post_app_text_post_app_following: [] }),
      files.likedThreads
        ? parseJsonFile<ThreadLikesResponse>(files.likedThreads)
        : Promise.resolve({ text_post_app_media_likes: [] }),
      files.savedThreads
        ? parseJsonFile<ThreadSavedPostsResponse>(files.savedThreads)
        : Promise.resolve({ text_post_app_text_post_app_saved_posts: [] }),
    ]);

    return {
      posts: threadsData.text_post_app_text_posts.map(completeSingleMedia),
      followers: followersData.text_post_app_text_post_app_followers || [],
      following: followingData.text_post_app_text_post_app_following || [],
      likes: likesData.text_post_app_media_likes || [],
      savedPosts: savedData.text_post_app_text_post_app_saved_posts || [],
    };
  }

  return { parseAllFiles };
}
