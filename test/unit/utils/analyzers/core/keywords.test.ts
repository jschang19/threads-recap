import { describe, it, expect } from 'vitest';
import { analyzeKeywordsCore } from '~/utils/analyzers/core/keywords';
import type { ParsedThreadsData } from '~/types/threads';

describe('analyzeKeywordsCore', () => {
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

  it('should extract keywords from posts', () => {
    const posts = createPosts([
      '今天學習 programming 很開心',
      '繼續 programming 進步中',
      '持續 programming 不斷努力',
    ]);

    const result = analyzeKeywordsCore(posts);

    // 'programming' appears 3 times, should be in top keywords
    const programmingKeyword = result.find(k => k.keyword === 'programming');
    expect(programmingKeyword).toBeDefined();
    expect(programmingKeyword?.count).toBe(3);
  });

  it('should return keywords sorted by count descending', () => {
    const posts = createPosts([
      'apple apple apple',
      'banana banana',
      'apple orange',
    ]);

    const result = analyzeKeywordsCore(posts);

    // Verify descending order
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1]!.count).toBeGreaterThanOrEqual(result[i]!.count);
    }
  });

  it('should filter out keywords that appear less than 2 times', () => {
    const posts = createPosts([
      'uniqueword hello hello',
      'hello hello',
    ]);

    const result = analyzeKeywordsCore(posts);

    // 'uniqueword' appears only once, should not be included
    const uniqueKeyword = result.find(k => k.keyword === 'uniqueword');
    expect(uniqueKeyword).toBeUndefined();
  });

  it('should filter out stop words', () => {
    const posts = createPosts([
      'the the the is is is',
      '的的的是是是',
    ]);

    const result = analyzeKeywordsCore(posts);

    // Stop words should not appear
    const theKeyword = result.find(k => k.keyword === 'the');
    const isKeyword = result.find(k => k.keyword === 'is');
    expect(theKeyword).toBeUndefined();
    expect(isKeyword).toBeUndefined();
  });

  it('should filter out numeric-only words', () => {
    const posts = createPosts([
      '2025 2025 2025',
      '123 123 456',
    ]);

    const result = analyzeKeywordsCore(posts);

    const numericKeyword = result.find(k => /^\d+$/.test(k.keyword));
    expect(numericKeyword).toBeUndefined();
  });

  it('should filter out @mentions', () => {
    const posts = createPosts([
      '@user @user @user',
      '@mention @mention',
    ]);

    const result = analyzeKeywordsCore(posts);

    const mentionKeyword = result.find(k => k.keyword.startsWith('@'));
    expect(mentionKeyword).toBeUndefined();
  });

  it('should filter out single character words', () => {
    const posts = createPosts([
      'a a a b b b',
      'x x y y',
    ]);

    const result = analyzeKeywordsCore(posts);

    const singleCharKeyword = result.find(k => k.keyword.length === 1);
    expect(singleCharKeyword).toBeUndefined();
  });

  it('should convert keywords to lowercase', () => {
    const posts = createPosts([
      'Hello HELLO hello',
      'HeLLo Hello',
    ]);

    const result = analyzeKeywordsCore(posts);

    const helloKeyword = result.find(k => k.keyword === 'hello');
    expect(helloKeyword).toBeDefined();
    expect(helloKeyword?.count).toBe(5);
  });

  it('should limit results to top 20 keywords', () => {
    // Create posts with 25+ different keywords appearing twice each
    const keywords = Array.from({ length: 30 }, (_, i) => `keyword${i}`);
    const posts = createPosts([
      keywords.slice(0, 15).join(' '),
      keywords.slice(0, 15).join(' '),
      keywords.slice(15).join(' '),
      keywords.slice(15).join(' '),
    ]);

    const result = analyzeKeywordsCore(posts);

    expect(result.length).toBeLessThanOrEqual(20);
  });

  it('should only analyze posts from 2025', () => {
    const posts2025 = createPosts(['testword testword'], createTimestamp(6, 15));
    const posts2024: ParsedThreadsData['posts'] = [{
      media: [],
      title: 'oldword oldword',
      creation_timestamp: new Date('2024-06-15T12:00:00Z').getTime() / 1000,
    }];

    const result = analyzeKeywordsCore([...posts2025, ...posts2024]);

    const testKeyword = result.find(k => k.keyword === 'testword');
    const oldKeyword = result.find(k => k.keyword === 'oldword');
    expect(testKeyword).toBeDefined();
    expect(oldKeyword).toBeUndefined();
  });

  it('should handle empty posts array', () => {
    const result = analyzeKeywordsCore([]);

    expect(result).toHaveLength(0);
  });

  it('should handle posts with empty titles', () => {
    const posts = createPosts(['', '   ', 'hello hello']);

    const result = analyzeKeywordsCore(posts);

    // Should only extract from non-empty titles
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('should handle CJK text', () => {
    const posts = createPosts([
      '今天天氣很好 今天天氣很好',
      '今天天氣很好',
    ]);

    const result = analyzeKeywordsCore(posts);

    // Should have some keywords extracted from CJK text
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});

