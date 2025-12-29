import { describe, it, expect } from 'vitest';
import { analyzeSocialCore } from '~/utils/analyzers/core/social';
import type { ParsedThreadsData } from '~/types/threads';

describe('analyzeSocialCore', () => {
  // Helper to create a timestamp for a specific date in 2025
  const createTimestamp = (month: number, day: number) => {
    return new Date(`2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`).getTime() / 1000;
  };

  // Helper to create a timestamp for 2024
  const createTimestamp2024 = (month: number, day: number) => {
    return new Date(`2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`).getTime() / 1000;
  };

  // Mock data factories
  const createFollowers = (timestamps: number[]): ParsedThreadsData['followers'] => {
    return timestamps.map((timestamp, i) => ({
      title: `follower${i}`,
      string_list_data: [{ href: '', value: `user${i}`, timestamp }],
    }));
  };

  const createFollowing = (timestamps: number[]): ParsedThreadsData['following'] => {
    return timestamps.map((timestamp, i) => ({
      title: `following${i}`,
      string_list_data: [{ href: '', value: `user${i}`, timestamp }],
    }));
  };

  const createLikes = (timestampArrays: number[][]): ParsedThreadsData['likes'] => {
    return timestampArrays.map((timestamps, i) => ({
      title: `liked${i}`,
      media_list_data: [],
      string_list_data: timestamps.map(timestamp => ({
        href: '',
        value: `post${i}`,
        timestamp,
      })),
    }));
  };

  const createSavedPosts = (timestamps: number[]): ParsedThreadsData['savedPosts'] => {
    return timestamps.map((timestamp, i) => ({
      title: `saved${i}`,
      media_map_data: {},
      string_map_data: {
        '儲存時間': { href: '', value: '', timestamp },
      },
    }));
  };

  describe('followers analysis', () => {
    it('should count total followers', () => {
      const followers = createFollowers([
        createTimestamp(1, 1),
        createTimestamp(2, 1),
        createTimestamp2024(12, 1),
      ]);

      const result = analyzeSocialCore(followers, [], [], []);

      expect(result.totalFollowers).toBe(3);
    });

    it('should count new followers in 2025', () => {
      const followers = createFollowers([
        createTimestamp(1, 1),
        createTimestamp(6, 15),
        createTimestamp2024(12, 1),
        createTimestamp2024(6, 15),
      ]);

      const result = analyzeSocialCore(followers, [], [], []);

      expect(result.newFollowersIn2025).toBe(2);
    });

    it('should calculate follower growth by month', () => {
      const followers = createFollowers([
        createTimestamp(1, 15), // January
        createTimestamp(1, 20), // January
        createTimestamp(3, 10), // March
        createTimestamp(6, 5), // June
      ]);

      const result = analyzeSocialCore(followers, [], [], []);

      // Check cumulative growth
      expect(result.followerGrowthByMonth).toHaveLength(12);

      const januaryData = result.followerGrowthByMonth.find(d => d.month === 1);
      expect(januaryData?.cumulative).toBe(2);

      const marchData = result.followerGrowthByMonth.find(d => d.month === 3);
      expect(marchData?.cumulative).toBe(3);

      const juneData = result.followerGrowthByMonth.find(d => d.month === 6);
      expect(juneData?.cumulative).toBe(4);
    });
  });

  describe('following analysis', () => {
    it('should count total following', () => {
      const following = createFollowing([
        createTimestamp(1, 1),
        createTimestamp(2, 1),
        createTimestamp2024(12, 1),
      ]);

      const result = analyzeSocialCore([], following, [], []);

      expect(result.totalFollowing).toBe(3);
    });

    it('should count new following in 2025', () => {
      const following = createFollowing([
        createTimestamp(1, 1),
        createTimestamp(6, 15),
        createTimestamp2024(12, 1),
      ]);

      const result = analyzeSocialCore([], following, [], []);

      expect(result.newFollowingIn2025).toBe(2);
    });
  });

  describe('likes analysis', () => {
    it('should count total likes', () => {
      const likes = createLikes([
        [createTimestamp(1, 1), createTimestamp(2, 1)],
        [createTimestamp(3, 1)],
      ]);

      const result = analyzeSocialCore([], [], likes, []);

      expect(result.totalLikes).toBe(3);
    });

    it('should count likes in 2025', () => {
      const likes = createLikes([
        [createTimestamp(1, 1), createTimestamp2024(12, 1)],
        [createTimestamp(3, 1), createTimestamp2024(6, 1)],
      ]);

      const result = analyzeSocialCore([], [], likes, []);

      expect(result.likesIn2025).toBe(2);
    });

    it('should handle likes with empty string_list_data', () => {
      const likes: ParsedThreadsData['likes'] = [
        { title: 'liked', media_list_data: [], string_list_data: [] },
      ];

      const result = analyzeSocialCore([], [], likes, []);

      expect(result.totalLikes).toBe(0);
      expect(result.likesIn2025).toBe(0);
    });
  });

  describe('saved posts analysis', () => {
    it('should count total saved posts', () => {
      const savedPosts = createSavedPosts([
        createTimestamp(1, 1),
        createTimestamp(2, 1),
        createTimestamp2024(12, 1),
      ]);

      const result = analyzeSocialCore([], [], [], savedPosts);

      expect(result.totalSaved).toBe(3);
    });

    it('should count saved posts in 2025', () => {
      const savedPosts = createSavedPosts([
        createTimestamp(1, 1),
        createTimestamp(6, 15),
        createTimestamp2024(12, 1),
      ]);

      const result = analyzeSocialCore([], [], [], savedPosts);

      expect(result.savedIn2025).toBe(2);
    });

    it('should handle saved posts without timestamp', () => {
      const savedPosts: ParsedThreadsData['savedPosts'] = [
        { title: 'saved', media_map_data: {}, string_map_data: {} },
      ];

      const result = analyzeSocialCore([], [], [], savedPosts);

      expect(result.totalSaved).toBe(1);
      expect(result.savedIn2025).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle all empty arrays', () => {
      const result = analyzeSocialCore([], [], [], []);

      expect(result.totalFollowers).toBe(0);
      expect(result.newFollowersIn2025).toBe(0);
      expect(result.totalFollowing).toBe(0);
      expect(result.newFollowingIn2025).toBe(0);
      expect(result.totalLikes).toBe(0);
      expect(result.likesIn2025).toBe(0);
      expect(result.totalSaved).toBe(0);
      expect(result.savedIn2025).toBe(0);
      expect(result.followerGrowthByMonth).toHaveLength(12);
    });

    it('should handle followers without string_list_data', () => {
      const followers: ParsedThreadsData['followers'] = [
        { title: 'follower1', string_list_data: [] },
      ];

      const result = analyzeSocialCore(followers, [], [], []);

      expect(result.totalFollowers).toBe(1);
      expect(result.newFollowersIn2025).toBe(0);
    });
  });
});

