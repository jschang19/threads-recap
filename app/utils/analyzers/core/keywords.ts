import type { KeywordCount, ParsedThreadsData } from '~/types/threads';
import { STOP_WORDS } from '~/constants';
import { isIn2025, simpleSegment } from '../helpers';

/**
 * Analyze keywords from posts (synchronous, uses Intl.Segmenter)
 */
export function analyzeKeywordsCore(posts: ParsedThreadsData['posts']): KeywordCount[] {
  const posts2025 = posts.filter(post => isIn2025(post.creation_timestamp));
  const keywordCounts = new Map<string, number>();

  for (const post of posts2025) {
    const title = post.title || '';
    if (!title.trim()) continue;

    const words = simpleSegment(title);

    for (const word of words) {
      const cleanWord = word.trim().toLowerCase();
      if (
        cleanWord.length >= 2
        && !STOP_WORDS.has(cleanWord)
        && !/^\d+$/.test(cleanWord)
        && !cleanWord.startsWith('@')
      ) {
        keywordCounts.set(cleanWord, (keywordCounts.get(cleanWord) || 0) + 1);
      }
    }
  }

  return Array.from(keywordCounts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .filter(item => item.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}
