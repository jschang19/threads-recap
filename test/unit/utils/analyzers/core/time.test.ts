import { describe, it, expect } from 'vitest';
import { analyzeTimeCore } from '~/utils/analyzers/core/time';
import type { ParsedThreadsData } from '~/types/threads';

describe('analyzeTimeCore', () => {
  // Helper to create a timestamp for a specific date in 2025
  const createTimestamp = (month: number, day: number, hour = 12) => {
    return new Date(`2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`).getTime() / 1000;
  };

  // Helper to create mock posts
  const createPosts = (timestamps: number[]): ParsedThreadsData['posts'] => {
    return timestamps.map(timestamp => ({
      media: [],
      title: 'Test post',
      creation_timestamp: timestamp,
    }));
  };

  describe('monthly stats', () => {
    it('should count posts per month', () => {
      const posts = createPosts([
        createTimestamp(1, 1), // January
        createTimestamp(1, 15), // January
        createTimestamp(3, 10), // March
        createTimestamp(6, 20), // June
      ]);

      const result = analyzeTimeCore(posts);

      const january = result.monthlyStats.find(s => s.month === 1);
      const march = result.monthlyStats.find(s => s.month === 3);
      const june = result.monthlyStats.find(s => s.month === 6);

      expect(january?.postCount).toBe(2);
      expect(march?.postCount).toBe(1);
      expect(june?.postCount).toBe(1);
    });

    it('should include all 12 months in stats', () => {
      const posts = createPosts([createTimestamp(1, 1)]);

      const result = analyzeTimeCore(posts);

      expect(result.monthlyStats).toHaveLength(12);
      expect(result.monthlyStats.map(s => s.month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('should set year to 2025 for all stats', () => {
      const posts = createPosts([createTimestamp(6, 15)]);

      const result = analyzeTimeCore(posts);

      result.monthlyStats.forEach((stat) => {
        expect(stat.year).toBe(2025);
      });
    });

    it('should initialize followerGain to 0', () => {
      const posts = createPosts([createTimestamp(6, 15)]);

      const result = analyzeTimeCore(posts);

      result.monthlyStats.forEach((stat) => {
        expect(stat.followerGain).toBe(0);
      });
    });
  });

  describe('most active month', () => {
    it('should identify the most active month', () => {
      const posts = createPosts([
        createTimestamp(1, 1),
        createTimestamp(6, 1), // June - 3 posts
        createTimestamp(6, 10),
        createTimestamp(6, 20),
        createTimestamp(12, 1),
      ]);

      const result = analyzeTimeCore(posts);

      expect(result.mostActiveMonth).toBe(6);
    });

    it('should return first month when no posts', () => {
      const result = analyzeTimeCore([]);

      expect(result.mostActiveMonth).toBe(1);
    });
  });

  describe('most active day', () => {
    it('should identify the most active day of week', () => {
      // Create posts on different days
      // January 6, 2025 is a Monday (dayOfWeek = 1)
      // January 7, 2025 is a Tuesday (dayOfWeek = 2)
      const posts = createPosts([
        new Date('2025-01-06T12:00:00Z').getTime() / 1000, // Monday
        new Date('2025-01-13T12:00:00Z').getTime() / 1000, // Monday
        new Date('2025-01-20T12:00:00Z').getTime() / 1000, // Monday
        new Date('2025-01-07T12:00:00Z').getTime() / 1000, // Tuesday
      ]);

      const result = analyzeTimeCore(posts);

      expect(result.mostActiveDay).toBe('週一');
    });

    it('should return default day when no posts', () => {
      const result = analyzeTimeCore([]);

      expect(result.mostActiveDay).toBe('週日');
    });
  });

  describe('heatmap data', () => {
    it('should generate heatmap data for all month-day combinations', () => {
      const posts = createPosts([createTimestamp(1, 1)]);

      const result = analyzeTimeCore(posts);

      // 12 months * 7 days = 84 cells
      expect(result.heatmapData).toHaveLength(84);
    });

    it('should track post counts in heatmap', () => {
      // January 5, 2025 is a Sunday (dayOfWeek = 0)
      const posts = createPosts([
        new Date('2025-01-05T12:00:00Z').getTime() / 1000, // January, Sunday
        new Date('2025-01-12T12:00:00Z').getTime() / 1000, // January, Sunday
      ]);

      const result = analyzeTimeCore(posts);

      const januarySunday = result.heatmapData.find(
        cell => cell.month === 0 && cell.dayOfWeek === 0,
      );
      expect(januarySunday?.count).toBe(2);
    });
  });

  describe('posts in 2025', () => {
    it('should count only posts from 2025', () => {
      const posts2025 = createPosts([createTimestamp(1, 1), createTimestamp(6, 15)]);
      const posts2024: ParsedThreadsData['posts'] = [{
        media: [],
        title: 'Old post',
        creation_timestamp: new Date('2024-06-15T12:00:00Z').getTime() / 1000,
      }];

      const result = analyzeTimeCore([...posts2025, ...posts2024]);

      expect(result.postsIn2025).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty posts array', () => {
      const result = analyzeTimeCore([]);

      expect(result.postsIn2025).toBe(0);
      expect(result.monthlyStats).toHaveLength(12);
      expect(result.heatmapData).toHaveLength(84);
    });

    it('should handle posts at year boundaries', () => {
      const posts = createPosts([
        new Date('2025-01-01T00:00:00Z').getTime() / 1000, // First second of 2025
        new Date('2025-12-31T23:59:59Z').getTime() / 1000, // Last second of 2025
      ]);

      const result = analyzeTimeCore(posts);

      expect(result.postsIn2025).toBe(2);
    });
  });
});

