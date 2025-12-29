import { describe, it, expect } from 'vitest';
import { analyzeTextCore } from '~/utils/analyzers/core/text';
import type { ParsedThreadsData } from '~/types/threads';

describe('analyzeTextCore', () => {
  // Helper to create a timestamp for a specific date in 2025
  const createTimestamp = (month: number, day: number) => {
    return new Date(`2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`).getTime() / 1000;
  };

  // Helper to create mock posts
  const createPosts = (titles: string[], timestamp = createTimestamp(6, 15)): ParsedThreadsData['posts'] => {
    return titles.map(title => ({
      media: [],
      title,
      creation_timestamp: timestamp,
    }));
  };

  describe('post counting', () => {
    it('should count total posts in 2025', () => {
      const posts = createPosts(['Post 1', 'Post 2', 'Post 3']);

      const result = analyzeTextCore(posts);

      expect(result.totalPosts).toBe(3);
    });

    it('should only count posts from 2025', () => {
      const posts2025 = createPosts(['Post 1', 'Post 2']);
      const posts2024: ParsedThreadsData['posts'] = createPosts(
        ['Old Post'],
        new Date('2024-06-15T12:00:00Z').getTime() / 1000,
      );

      const result = analyzeTextCore([...posts2025, ...posts2024]);

      expect(result.totalPosts).toBe(2);
    });
  });

  describe('word counting', () => {
    it('should count total words across all posts', () => {
      const posts = createPosts([
        'Hello world',
        'This is a test',
      ]);

      const result = analyzeTextCore(posts);

      expect(result.totalWordCount).toBeGreaterThan(0);
    });

    it('should handle CJK text', () => {
      const posts = createPosts(['今天天氣很好']);

      const result = analyzeTextCore(posts);

      expect(result.totalWordCount).toBeGreaterThan(0);
    });

    it('should calculate average words per post', () => {
      const posts = createPosts([
        'One two three', // 3 words
        'Four five six seven', // 4 words
      ]);

      const result = analyzeTextCore(posts);

      expect(result.averageWordsPerPost).toBeGreaterThan(0);
    });

    it('should return 0 average for empty posts', () => {
      const result = analyzeTextCore([]);

      expect(result.averageWordsPerPost).toBe(0);
    });
  });

  describe('character counting', () => {
    it('should count total characters excluding whitespace', () => {
      const posts = createPosts(['Hello world']); // 10 chars (no space)

      const result = analyzeTextCore(posts);

      expect(result.totalCharCount).toBe(10);
    });

    it('should handle empty titles', () => {
      const posts = createPosts(['', '   ']);

      const result = analyzeTextCore(posts);

      expect(result.totalCharCount).toBe(0);
    });
  });

  describe('mentions analysis', () => {
    it('should extract and count mentions', () => {
      const posts = createPosts([
        'Hello @user1 and @user2',
        'Hey @user1, how are you @user3',
      ]);

      const result = analyzeTextCore(posts);

      expect(result.topMentions.length).toBeGreaterThan(0);

      const user1 = result.topMentions.find(m => m.username === 'user1');
      expect(user1).toBeDefined();
      expect(user1?.count).toBe(2);
    });

    it('should return top 3 mentions sorted by count', () => {
      const posts = createPosts([
        '@a @a @a @a @b @b @b @c @c @d',
      ]);

      const result = analyzeTextCore(posts);

      expect(result.topMentions.length).toBeLessThanOrEqual(3);

      // Verify descending order
      for (let i = 1; i < result.topMentions.length; i++) {
        expect(result.topMentions[i - 1]!.count).toBeGreaterThanOrEqual(result.topMentions[i]!.count);
      }
    });

    it('should convert mentions to lowercase', () => {
      const posts = createPosts([
        '@UserName @USERNAME @username',
      ]);

      const result = analyzeTextCore(posts);

      const mention = result.topMentions.find(m => m.username === 'username');
      expect(mention).toBeDefined();
      expect(mention?.count).toBe(3);
    });

    it('should handle posts without mentions', () => {
      const posts = createPosts(['Hello world', 'No mentions here']);

      const result = analyzeTextCore(posts);

      expect(result.topMentions).toHaveLength(0);
    });
  });

  describe('initialization', () => {
    it('should initialize topKeywords as empty array', () => {
      const posts = createPosts(['Hello world']);

      const result = analyzeTextCore(posts);

      expect(result.topKeywords).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty posts array', () => {
      const result = analyzeTextCore([]);

      expect(result.totalPosts).toBe(0);
      expect(result.totalWordCount).toBe(0);
      expect(result.totalCharCount).toBe(0);
      expect(result.averageWordsPerPost).toBe(0);
      expect(result.topMentions).toHaveLength(0);
    });

    it('should handle posts with undefined title', () => {
      const posts: ParsedThreadsData['posts'] = [{
        media: [],
        title: undefined as unknown as string,
        creation_timestamp: createTimestamp(6, 15),
      }];

      const result = analyzeTextCore(posts);

      expect(result.totalWordCount).toBe(0);
      expect(result.totalCharCount).toBe(0);
    });

    it('should handle posts with null title', () => {
      const posts: ParsedThreadsData['posts'] = [{
        media: [],
        title: null as unknown as string,
        creation_timestamp: createTimestamp(6, 15),
      }];

      const result = analyzeTextCore(posts);

      expect(result.totalWordCount).toBe(0);
      expect(result.totalCharCount).toBe(0);
    });
  });
});

