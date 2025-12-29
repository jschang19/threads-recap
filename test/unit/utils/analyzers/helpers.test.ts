import { describe, it, expect } from 'vitest';
import {
  isIn2025,
  countWords,
  countCharacters,
  extractMentions,
  simpleSegment,
} from '~/utils/analyzers/helpers';
import { YEAR_2025_START, YEAR_2025_END } from '~/constants';

describe('isIn2025', () => {
  it('should return true for timestamps within 2025', () => {
    // January 1, 2025 00:00:00 UTC
    expect(isIn2025(YEAR_2025_START)).toBe(true);

    // December 31, 2025 23:59:59 UTC
    expect(isIn2025(YEAR_2025_END)).toBe(true);

    // Mid-year: July 1, 2025
    const midYear2025 = new Date('2025-07-01T12:00:00Z').getTime() / 1000;
    expect(isIn2025(midYear2025)).toBe(true);
  });

  it('should return false for timestamps before 2025', () => {
    // December 31, 2024 23:59:59 UTC
    const lastSecondOf2024 = new Date('2024-12-31T23:59:59Z').getTime() / 1000;
    expect(isIn2025(lastSecondOf2024)).toBe(false);

    // January 1, 2024
    const earlyDate = new Date('2024-01-01T00:00:00Z').getTime() / 1000;
    expect(isIn2025(earlyDate)).toBe(false);
  });

  it('should return false for timestamps after 2025', () => {
    // January 1, 2026 00:00:00 UTC
    const firstSecondOf2026 = new Date('2026-01-01T00:00:00Z').getTime() / 1000;
    expect(isIn2025(firstSecondOf2026)).toBe(false);

    // July 2026
    const midYear2026 = new Date('2026-07-01T00:00:00Z').getTime() / 1000;
    expect(isIn2025(midYear2026)).toBe(false);
  });
});

describe('countWords', () => {
  it('should count English words correctly', () => {
    expect(countWords('Hello world')).toBe(2);
    expect(countWords('This is a test sentence')).toBe(5);
    expect(countWords('One')).toBe(1);
  });

  it('should count CJK characters/words correctly', () => {
    // Chinese text
    expect(countWords('你好世界')).toBeGreaterThan(0);
    expect(countWords('今天天氣很好')).toBeGreaterThan(0);
  });

  it('should count mixed language text', () => {
    const mixedText = 'Hello 你好 World 世界';
    expect(countWords(mixedText)).toBeGreaterThan(0);
  });

  it('should return 0 for empty or whitespace-only text', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countWords('\n\t')).toBe(0);
  });

  it('should handle null/undefined gracefully', () => {
    expect(countWords(null as unknown as string)).toBe(0);
    expect(countWords(undefined as unknown as string)).toBe(0);
  });
});

describe('countCharacters', () => {
  it('should count characters excluding whitespace', () => {
    expect(countCharacters('hello')).toBe(5);
    expect(countCharacters('hello world')).toBe(10);
    expect(countCharacters('a b c')).toBe(3);
  });

  it('should count CJK characters correctly', () => {
    expect(countCharacters('你好')).toBe(2);
    expect(countCharacters('你好世界')).toBe(4);
  });

  it('should exclude all types of whitespace', () => {
    expect(countCharacters('hello\tworld')).toBe(10);
    expect(countCharacters('hello\nworld')).toBe(10);
    expect(countCharacters('hello   world')).toBe(10);
  });

  it('should return 0 for empty text', () => {
    expect(countCharacters('')).toBe(0);
    expect(countCharacters('   ')).toBe(0);
  });

  it('should handle null/undefined gracefully', () => {
    expect(countCharacters(null as unknown as string)).toBe(0);
    expect(countCharacters(undefined as unknown as string)).toBe(0);
  });
});

describe('extractMentions', () => {
  it('should extract single @mention', () => {
    const mentions = extractMentions('Hello @user123 how are you');
    expect(mentions).toContain('user123');
    expect(mentions).toHaveLength(1);
  });

  it('should extract multiple @mentions', () => {
    const mentions = extractMentions('Hey @alice and @bob, meet @charlie');
    expect(mentions).toContain('alice');
    expect(mentions).toContain('bob');
    expect(mentions).toContain('charlie');
    expect(mentions).toHaveLength(3);
  });

  it('should handle usernames with underscores and periods', () => {
    const mentions = extractMentions('@user_name @user.name @user_name.test');
    expect(mentions).toContain('user_name');
    expect(mentions).toContain('user.name');
    expect(mentions).toContain('user_name.test');
  });

  it('should filter out single character usernames', () => {
    const mentions = extractMentions('@a @ab @abc');
    expect(mentions).not.toContain('a');
    expect(mentions).toContain('ab');
    expect(mentions).toContain('abc');
  });

  it('should filter out numeric-only usernames', () => {
    const mentions = extractMentions('@123 @456 @user123');
    expect(mentions).not.toContain('123');
    expect(mentions).not.toContain('456');
    expect(mentions).toContain('user123');
  });

  it('should return empty array for text without mentions', () => {
    expect(extractMentions('Hello world')).toHaveLength(0);
    expect(extractMentions('')).toHaveLength(0);
  });

  it('should handle null/undefined gracefully', () => {
    expect(extractMentions(null as unknown as string)).toHaveLength(0);
    expect(extractMentions(undefined as unknown as string)).toHaveLength(0);
  });
});

describe('simpleSegment', () => {
  it('should segment English text into words', () => {
    const segments = simpleSegment('Hello world');
    expect(segments.length).toBeGreaterThan(0);
    expect(segments).toContain('Hello');
    expect(segments).toContain('world');
  });

  it('should segment CJK text', () => {
    const segments = simpleSegment('你好世界');
    expect(segments.length).toBeGreaterThan(0);
  });

  it('should segment mixed language text', () => {
    const segments = simpleSegment('Hello 你好');
    expect(segments.length).toBeGreaterThan(0);
    expect(segments).toContain('Hello');
  });

  it('should filter out non-word-like segments', () => {
    const segments = simpleSegment('Hello, world! How are you?');
    // Punctuation should be filtered out
    expect(segments).not.toContain(',');
    expect(segments).not.toContain('!');
    expect(segments).not.toContain('?');
  });
});

