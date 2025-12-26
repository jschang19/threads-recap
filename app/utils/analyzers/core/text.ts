import type { ParsedThreadsData, TextAnalysisResult } from '~/types/threads';
import { countCharacters, countWords, extractMentions, isIn2025 } from '../helpers';

/**
 * Analyze text content from posts
 */
export function analyzeTextCore(posts: ParsedThreadsData['posts']): TextAnalysisResult {
  const posts2025 = posts.filter(post => isIn2025(post.creation_timestamp));

  let totalWordCount = 0;
  let totalCharCount = 0;
  const mentionCounts = new Map<string, number>();

  for (const post of posts2025) {
    const title = post.title || '';
    totalWordCount += countWords(title);
    totalCharCount += countCharacters(title);

    const mentions = extractMentions(title);
    for (const mention of mentions) {
      const lowerMention = mention.toLowerCase();
      mentionCounts.set(lowerMention, (mentionCounts.get(lowerMention) || 0) + 1);
    }
  }

  const topMentions = Array.from(mentionCounts.entries())
    .map(([username, count]) => ({ username, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    totalPosts: posts.length,
    totalWordCount,
    totalCharCount,
    averageWordsPerPost: posts2025.length > 0 ? Math.round(totalWordCount / posts2025.length) : 0,
    topMentions,
    topKeywords: [],
  };
}


