import { describe, it, expect, vi } from 'vitest';
import { runAnalysisPipeline } from '~/utils/analyzers/pipeline';
import type { ParsedThreadsData } from '~/types/threads';
import type { ProgressCallback } from '~/types/pipeline';

describe('runAnalysisPipeline', () => {
  // Helper to create a timestamp for 2025
  const createTimestamp = (month: number, day: number) => {
    return new Date(`2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`).getTime() / 1000;
  };

  // Create minimal mock data
  const createMockData = (overrides: Partial<ParsedThreadsData> = {}): ParsedThreadsData => ({
    posts: [
      {
        media: [],
        title: 'Hello @friend this is a test post about programming',
        creation_timestamp: createTimestamp(6, 15),
      },
      {
        media: [],
        title: 'Another post about programming and coding',
        creation_timestamp: createTimestamp(6, 20),
      },
    ],
    followers: [
      {
        title: 'follower1',
        string_list_data: [{ href: '', value: 'user1', timestamp: createTimestamp(3, 10) }],
      },
    ],
    following: [
      {
        title: 'following1',
        string_list_data: [{ href: '', value: 'user2', timestamp: createTimestamp(4, 15) }],
      },
    ],
    likes: [
      {
        title: 'liked1',
        media_list_data: [],
        string_list_data: [
          { href: '', value: 'post1', timestamp: createTimestamp(5, 1) },
          { href: '', value: 'post2', timestamp: createTimestamp(5, 2) },
        ],
      },
    ],
    savedPosts: [
      {
        title: 'saved1',
        media_map_data: {},
        string_map_data: {
          儲存時間: { href: '', value: '', timestamp: createTimestamp(6, 1) },
        },
      },
    ],
    ...overrides,
  });

  describe('pipeline execution', () => {
    it('should return complete analysis result', () => {
      const data = createMockData();

      const result = runAnalysisPipeline(data);

      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('social');
      expect(result).toHaveProperty('funFacts');
    });

    it('should analyze text correctly', () => {
      const data = createMockData();

      const result = runAnalysisPipeline(data);

      expect(result.text.totalPosts).toBe(2);
      expect(result.text.totalWordCount).toBeGreaterThan(0);
      expect(result.text.totalCharCount).toBeGreaterThan(0);
    });

    it('should extract keywords and attach to text result', () => {
      const data = createMockData({
        posts: [
          { media: [], title: 'programming programming programming', creation_timestamp: createTimestamp(6, 1) },
          { media: [], title: 'programming coding coding', creation_timestamp: createTimestamp(6, 2) },
        ],
      });

      const result = runAnalysisPipeline(data);

      // Keywords should be populated
      expect(result.text.topKeywords).toBeDefined();
      expect(Array.isArray(result.text.topKeywords)).toBe(true);
    });

    it('should analyze time patterns', () => {
      const data = createMockData();

      const result = runAnalysisPipeline(data);

      expect(result.time.postsIn2025).toBe(2);
      expect(result.time.monthlyStats).toHaveLength(12);
      expect(result.time.heatmapData).toHaveLength(84);
      expect(result.time.mostActiveMonth).toBeGreaterThanOrEqual(1);
      expect(result.time.mostActiveDay).toBeDefined();
    });

    it('should analyze social metrics', () => {
      const data = createMockData();

      const result = runAnalysisPipeline(data);

      expect(result.social.totalFollowers).toBe(1);
      expect(result.social.newFollowersIn2025).toBe(1);
      expect(result.social.totalFollowing).toBe(1);
      expect(result.social.newFollowingIn2025).toBe(1);
      expect(result.social.totalLikes).toBe(2);
      expect(result.social.likesIn2025).toBe(2);
      expect(result.social.totalSaved).toBe(1);
      expect(result.social.savedIn2025).toBe(1);
    });

    it('should calculate fun facts', () => {
      const data = createMockData();

      const result = runAnalysisPipeline(data);

      expect(result.funFacts.booksEquivalent).toBeDefined();
      expect(result.funFacts.thesisEquivalent).toBeDefined();
      expect(result.funFacts.chouTseEquivalent).toBeDefined();
      expect(result.funFacts.holidayBadges).toBeDefined();
    });
  });

  describe('progress callback', () => {
    it('should call progress callback at each step', () => {
      const data = createMockData();
      const onProgress = vi.fn();

      runAnalysisPipeline(data, onProgress);

      // Should be called for each step (5 progress updates + 1 final completion)
      expect(onProgress).toHaveBeenCalledTimes(6);
    });

    it('should report correct progress stages', () => {
      const data = createMockData();
      const progressCalls: { stage: string; progress: number; message: string }[] = [];
      const onProgress: ProgressCallback = (stage, progress, message) => {
        progressCalls.push({ stage, progress, message });
      };

      runAnalysisPipeline(data, onProgress);

      expect(progressCalls[0]?.stage).toBe('analyzing-text');
      expect(progressCalls[0]?.progress).toBe(20);

      expect(progressCalls[1]?.stage).toBe('analyzing-keywords');
      expect(progressCalls[1]?.progress).toBe(40);

      expect(progressCalls[2]?.stage).toBe('analyzing-time');
      expect(progressCalls[2]?.progress).toBe(60);

      expect(progressCalls[3]?.stage).toBe('analyzing-social');
      expect(progressCalls[3]?.progress).toBe(80);

      expect(progressCalls[4]?.stage).toBe('complete');
      expect(progressCalls[4]?.progress).toBe(95);

      expect(progressCalls[5]?.stage).toBe('complete');
      expect(progressCalls[5]?.progress).toBe(100);
    });

    it('should work without progress callback', () => {
      const data = createMockData();

      // Should not throw
      expect(() => runAnalysisPipeline(data)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty data', () => {
      const emptyData: ParsedThreadsData = {
        posts: [],
        followers: [],
        following: [],
        likes: [],
        savedPosts: [],
      };

      const result = runAnalysisPipeline(emptyData);

      expect(result.text.totalPosts).toBe(0);
      expect(result.time.postsIn2025).toBe(0);
      expect(result.social.totalFollowers).toBe(0);
    });

    it('should handle data with only 2024 posts', () => {
      const data = createMockData({
        posts: [
          {
            media: [],
            title: 'Old post',
            creation_timestamp: new Date('2024-06-15T12:00:00Z').getTime() / 1000,
          },
        ],
      });

      const result = runAnalysisPipeline(data);

      expect(result.text.totalPosts).toBe(0);
      expect(result.time.postsIn2025).toBe(0);
    });
  });
});
