import { describe, it, expect } from 'vitest';
import { calculateFunFactsCore } from '~/utils/analyzers/core/fun-facts';
import { FUN_FACTS_CONSTANTS } from '~/constants';

describe('calculateFunFactsCore', () => {
  // Helper to create a timestamp for a specific date in 2025
  const createTimestamp = (month: number, day: number) => {
    return new Date(`2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`).getTime() / 1000;
  };

  describe('word count equivalents', () => {
    it('should calculate books equivalent correctly', () => {
      const { HARRY_POTTER_WORDS } = FUN_FACTS_CONSTANTS;
      const result = calculateFunFactsCore(HARRY_POTTER_WORDS, []);

      expect(result.booksEquivalent).toBe(1);
    });

    it('should calculate thesis equivalent correctly', () => {
      const { THESIS_WORDS } = FUN_FACTS_CONSTANTS;
      const result = calculateFunFactsCore(THESIS_WORDS, []);

      expect(result.thesisEquivalent).toBe(1);
    });

    it('should calculate chou tse equivalent correctly', () => {
      const { CHOU_TSE_WORDS } = FUN_FACTS_CONSTANTS;
      const result = calculateFunFactsCore(CHOU_TSE_WORDS, []);

      expect(result.chouTseEquivalent).toBe(1);
    });

    it('should calculate partial equivalents correctly', () => {
      const { HARRY_POTTER_WORDS } = FUN_FACTS_CONSTANTS;
      const result = calculateFunFactsCore(HARRY_POTTER_WORDS / 2, []);

      expect(result.booksEquivalent).toBe(0.5);
    });

    it('should handle zero word count', () => {
      const result = calculateFunFactsCore(0, []);

      expect(result.booksEquivalent).toBe(0);
      expect(result.thesisEquivalent).toBe(0);
      expect(result.chouTseEquivalent).toBe(0);
    });
  });

  describe('holiday badges', () => {
    it('should award Christmas badge for December 24-25 posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(12, 24) },
        { creation_timestamp: createTimestamp(12, 25) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges).toContain('🎄 聖誕大使');
    });

    it('should award New Year badge for January 1 posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(1, 1) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges).toContain('🎉 新年先鋒');
    });

    it('should award New Year Eve badge for December 31 posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(12, 31) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges).toContain('✨ 跨年戰士');
    });

    it('should award Valentine\'s Day badge for February 14 posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(2, 14) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges).toContain('💕 情人節達人');
    });

    it('should award Lunar New Year badge for January 28-31 posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(1, 29) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges).toContain('🧧 新春報喜');
    });

    it('should award multiple badges for multiple holidays', () => {
      const posts = [
        { creation_timestamp: createTimestamp(1, 1) },
        { creation_timestamp: createTimestamp(12, 25) },
        { creation_timestamp: createTimestamp(2, 14) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(true);
      expect(result.holidayBadges.length).toBeGreaterThanOrEqual(3);
    });

    it('should not duplicate badges for multiple posts on same holiday', () => {
      const posts = [
        { creation_timestamp: createTimestamp(12, 25) },
        { creation_timestamp: createTimestamp(12, 25) + 3600 }, // Same day, 1 hour later
      ];

      const result = calculateFunFactsCore(1000, posts);

      const christmasBadges = result.holidayBadges.filter(b => b.includes('聖誕'));
      expect(christmasBadges).toHaveLength(1);
    });

    it('should return empty badges for non-holiday posts', () => {
      const posts = [
        { creation_timestamp: createTimestamp(3, 15) },
        { creation_timestamp: createTimestamp(6, 20) },
      ];

      const result = calculateFunFactsCore(1000, posts);

      expect(result.isHolidayPoster).toBe(false);
      expect(result.holidayBadges).toHaveLength(0);
    });

    it('should ignore posts outside 2025', () => {
      const posts2024 = [
        { creation_timestamp: new Date('2024-12-25T12:00:00Z').getTime() / 1000 },
      ];

      const result = calculateFunFactsCore(1000, posts2024);

      expect(result.isHolidayPoster).toBe(false);
      expect(result.holidayBadges).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty posts array', () => {
      const result = calculateFunFactsCore(1000, []);

      expect(result.isHolidayPoster).toBe(false);
      expect(result.holidayBadges).toHaveLength(0);
    });
  });
});

