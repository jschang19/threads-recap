import { describe, it, expect } from 'vitest';
import { useFileParser } from '~/composables/use-file-parser';
import type { UploadedFiles } from '~/types/threads';

describe('useFileParser', () => {
  it('should throw error when threadsAndReplies file is missing', async () => {
    const { parseAllFiles } = useFileParser();
    const files: UploadedFiles = {};

    await expect(parseAllFiles(files)).rejects.toThrow(/lack of required files for parsing/);
  });

  it('should parse valid threads data file', async () => {
    const { parseAllFiles } = useFileParser();

    const threadsData = {
      text_post_app_text_posts: [
        {
          id: '1',
          text: 'Test post',
          timestamp: 1234567890,
        },
      ],
    };

    const file = new File([JSON.stringify(threadsData)], 'threads_and_replies.json', {
      type: 'application/json',
    });

    const files: UploadedFiles = {
      threadsAndReplies: file,
    };

    const result = await parseAllFiles(files);

    expect(result).toHaveProperty('posts');
    expect(result).toHaveProperty('followers');
    expect(result).toHaveProperty('following');
    expect(result).toHaveProperty('likes');
    expect(result).toHaveProperty('savedPosts');
    expect(result.posts).toHaveLength(1);
    expect(result.followers).toEqual([]);
    expect(result.following).toEqual([]);
    expect(result.likes).toEqual([]);
    expect(result.savedPosts).toEqual([]);
  });

  it('should parse all optional files when provided', async () => {
    const { parseAllFiles } = useFileParser();

    const threadsData = {
      text_post_app_text_posts: [
        {
          id: '1',
          text: 'Test post',
          timestamp: 1234567890,
        },
      ],
    };

    const followersData = {
      text_post_app_text_post_app_followers: [
        { username: 'follower1' },
      ],
    };

    const followingData = {
      text_post_app_text_post_app_following: [
        { username: 'following1' },
      ],
    };

    const likesData = {
      text_post_app_media_likes: [
        { post_id: 'post1' },
      ],
    };

    const savedData = {
      text_post_app_text_post_app_saved_posts: [
        { post_id: 'saved1' },
      ],
    };

    const files: UploadedFiles = {
      threadsAndReplies: new File([JSON.stringify(threadsData)], 'threads_and_replies.json', {
        type: 'application/json',
      }),
      followers: new File([JSON.stringify(followersData)], 'followers.json', {
        type: 'application/json',
      }),
      following: new File([JSON.stringify(followingData)], 'following.json', {
        type: 'application/json',
      }),
      likedThreads: new File([JSON.stringify(likesData)], 'liked_threads.json', {
        type: 'application/json',
      }),
      savedThreads: new File([JSON.stringify(savedData)], 'saved_threads.json', {
        type: 'application/json',
      }),
    };

    const result = await parseAllFiles(files);

    expect(result.posts).toHaveLength(1);
    expect(result.followers).toHaveLength(1);
    expect(result.following).toHaveLength(1);
    expect(result.likes).toHaveLength(1);
    expect(result.savedPosts).toHaveLength(1);
  });

  it('should handle missing optional files gracefully', async () => {
    const { parseAllFiles } = useFileParser();

    const threadsData = {
      text_post_app_text_posts: [
        {
          id: '1',
          text: 'Test post',
          timestamp: 1234567890,
        },
      ],
    };

    const files: UploadedFiles = {
      threadsAndReplies: new File([JSON.stringify(threadsData)], 'threads_and_replies.json', {
        type: 'application/json',
      }),
      // Only followers provided, others missing
      followers: new File(
        [JSON.stringify({ text_post_app_text_post_app_followers: [{ username: 'follower1' }] })],
        'followers.json',
        { type: 'application/json' },
      ),
    };

    const result = await parseAllFiles(files);

    expect(result.posts).toHaveLength(1);
    expect(result.followers).toHaveLength(1);
    expect(result.following).toEqual([]);
    expect(result.likes).toEqual([]);
    expect(result.savedPosts).toEqual([]);
  });

  it('should throw descriptive error for invalid JSON in threads file', async () => {
    const { parseAllFiles } = useFileParser();

    const files: UploadedFiles = {
      threadsAndReplies: new File(['invalid json {'], 'threads_and_replies.json', {
        type: 'application/json',
      }),
      followers: new File([JSON.stringify({ text_post_app_text_post_app_followers: [] })], 'followers.json', {
        type: 'application/json',
      }),
      following: new File([JSON.stringify({ text_post_app_text_post_app_following: [] })], 'following.json', {
        type: 'application/json',
      }),
      likedThreads: new File([JSON.stringify({ text_post_app_media_likes: [] })], 'liked_threads.json', {
        type: 'application/json',
      }),
    };

    await expect(parseAllFiles(files)).rejects.toThrow(/Failed to parse threads_and_replies\.json/);
  });

  it('should throw error when text_post_app_text_posts is missing', async () => {
    const { parseAllFiles } = useFileParser();

    const threadsData = {
      // Missing text_post_app_text_posts property
      wrong_property: [],
    };

    const files: UploadedFiles = {
      threadsAndReplies: new File([JSON.stringify(threadsData)], 'threads_and_replies.json', {
        type: 'application/json',
      }),
      followers: new File([JSON.stringify({ text_post_app_text_post_app_followers: [] })], 'followers.json', {
        type: 'application/json',
      }),
      following: new File([JSON.stringify({ text_post_app_text_post_app_following: [] })], 'following.json', {
        type: 'application/json',
      }),
      likedThreads: new File([JSON.stringify({ text_post_app_media_likes: [] })], 'liked_threads.json', {
        type: 'application/json',
      }),
    };

    await expect(parseAllFiles(files)).rejects.toThrow(/missing "text_post_app_text_posts"/);
  });

  it('should throw error when text_post_app_text_posts is not an array', async () => {
    const { parseAllFiles } = useFileParser();

    const threadsData = {
      text_post_app_text_posts: 'not an array',
    };

    const files: UploadedFiles = {
      threadsAndReplies: new File([JSON.stringify(threadsData)], 'threads_and_replies.json', {
        type: 'application/json',
      }),
      followers: new File([JSON.stringify({ text_post_app_text_post_app_followers: [] })], 'followers.json', {
        type: 'application/json',
      }),
      following: new File([JSON.stringify({ text_post_app_text_post_app_following: [] })], 'following.json', {
        type: 'application/json',
      }),
      likedThreads: new File([JSON.stringify({ text_post_app_media_likes: [] })], 'liked_threads.json', {
        type: 'application/json',
      }),
    };

    await expect(parseAllFiles(files)).rejects.toThrow(/must be an array/);
  });
});
