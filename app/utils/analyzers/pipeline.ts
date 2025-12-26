/**
 * Unified analysis pipeline
 * Orchestrates all analyzers in a consistent flow
 * Used by both web worker and sync fallback
 */

import type {
  ParsedThreadsData,
  RecapAnalysisResult,
  TextAnalysisResult,
  TimeAnalysisResult,
  SocialAnalysisResult,
  FunFacts,
  KeywordCount,
} from '~/types/threads';
import { isIn2025, countWords, countCharacters, extractMentions, simpleSegment } from './helpers';
import { STOP_WORDS, DAY_NAMES, FUN_FACTS_CONSTANTS } from '~/constants';

export type AnalysisStage = 'parsing' | 'analyzing-text' | 'analyzing-keywords' | 'analyzing-time' | 'analyzing-social' | 'complete';

export interface ProgressCallback {
  (stage: AnalysisStage, progress: number, message: string): void;
}

/**
 * Analyze text content from posts
 */
export function analyzeTextCore(posts: ParsedThreadsData['posts']): TextAnalysisResult {
  const posts2025 = posts.filter(post => isIn2025(post.creation_timestamp));

  console.log('posts2025 in pipeline.ts analyzeTextCore', posts2025.length);
  console.log('posts in pipeline.ts analyzeTextCore', posts.length);

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

/**
 * Analyze time-based patterns from posts
 */
export function analyzeTimeCore(posts: ParsedThreadsData['posts']): TimeAnalysisResult {
  const posts2025 = posts.filter(post => isIn2025(post.creation_timestamp));

  const monthlyStatsMap = new Map<number, number>();
  for (let i = 0; i < 12; i++) {
    monthlyStatsMap.set(i, 0);
  }

  const heatmapMap = new Map<string, number>();
  for (let month = 0; month < 12; month++) {
    for (let day = 0; day < 7; day++) {
      heatmapMap.set(`${month}-${day}`, 0);
    }
  }

  for (const post of posts2025) {
    const date = new Date(post.creation_timestamp * 1000);
    const month = date.getMonth();
    const dayOfWeek = date.getDay();

    monthlyStatsMap.set(month, (monthlyStatsMap.get(month) || 0) + 1);

    const heatmapKey = `${month}-${dayOfWeek}`;
    heatmapMap.set(heatmapKey, (heatmapMap.get(heatmapKey) || 0) + 1);
  }

  const monthlyStats = Array.from(monthlyStatsMap.entries())
    .map(([month, count]) => ({
      month: month + 1,
      year: 2025,
      postCount: count,
      followerGain: 0,
    }))
    .sort((a, b) => a.month - b.month);

  const heatmapData = Array.from(heatmapMap.entries())
    .map(([key, count]) => {
      const parts = key.split('-');
      const month = parseInt(parts[0] || '0', 10);
      const dayOfWeek = parseInt(parts[1] || '0', 10);
      return { month, dayOfWeek, count };
    });

  const initialStats = monthlyStats[0] || { month: 1, year: 2025, postCount: 0, followerGain: 0 };
  const mostActiveMonthData = monthlyStats.reduce((max, current) => {
    return current.postCount > max.postCount ? current : max;
  }, initialStats);

  const dayTotals = new Map<number, number>();
  for (let day = 0; day < 7; day++) {
    dayTotals.set(day, 0);
  }
  for (const cell of heatmapData) {
    dayTotals.set(cell.dayOfWeek, (dayTotals.get(cell.dayOfWeek) || 0) + cell.count);
  }
  const mostActiveDayNum = Array.from(dayTotals.entries())
    .reduce((max, [day, count]) => count > max[1] ? [day, count] : max, [0, 0])[0];

  return {
    monthlyStats,
    heatmapData,
    mostActiveMonth: mostActiveMonthData.month,
    mostActiveDay: DAY_NAMES[mostActiveDayNum] || '週日',
    postsIn2025: posts2025.length,
  };
}

/**
 * Analyze social metrics
 */
export function analyzeSocialCore(
  followers: ParsedThreadsData['followers'],
  following: ParsedThreadsData['following'],
  likes: ParsedThreadsData['likes'],
  savedPosts: ParsedThreadsData['savedPosts'],
): SocialAnalysisResult {
  const getFollowTimestamp = (item: { string_list_data?: { timestamp: number }[] }) =>
    item.string_list_data?.[0]?.timestamp || 0;

  const totalFollowers = followers.length;
  const newFollowersIn2025 = followers.filter(f => isIn2025(getFollowTimestamp(f))).length;

  const totalFollowing = following.length;
  const newFollowingIn2025 = following.filter(f => isIn2025(getFollowTimestamp(f))).length;

  const totalLikes = likes.reduce((sum, like) => sum + (like.string_list_data?.length || 0), 0);
  const likesIn2025 = likes.reduce((sum, like) => {
    const likes2025 = (like.string_list_data || []).filter(data => isIn2025(data.timestamp));
    return sum + likes2025.length;
  }, 0);

  const totalSaved = savedPosts.length;
  const savedIn2025 = savedPosts.filter((post) => {
    const savedTimeData = post.string_map_data?.['儲存時間'];
    return savedTimeData && isIn2025(savedTimeData.timestamp);
  }).length;

  const followersByMonth = new Map<number, number>();
  for (let i = 1; i <= 12; i++) {
    followersByMonth.set(i, 0);
  }

  for (const follower of followers) {
    const timestamp = getFollowTimestamp(follower);
    if (isIn2025(timestamp)) {
      const date = new Date(timestamp * 1000);
      const month = date.getMonth() + 1;
      followersByMonth.set(month, (followersByMonth.get(month) || 0) + 1);
    }
  }

  let cumulative = 0;
  const followerGrowthByMonth = Array.from(followersByMonth.entries())
    .sort(([a], [b]) => a - b)
    .map(([month, count]) => {
      cumulative += count;
      return { month, cumulative };
    });

  return {
    totalFollowers,
    newFollowersIn2025,
    totalFollowing,
    newFollowingIn2025,
    totalLikes,
    likesIn2025,
    totalSaved,
    savedIn2025,
    followerGrowthByMonth,
  };
}

/**
 * Calculate fun facts from analysis results
 */
export function calculateFunFactsCore(
  totalWordCount: number,
  posts: { creation_timestamp: number }[],
): FunFacts {
  const { HARRY_POTTER_WORDS, THESIS_WORDS, CHOU_TSE_WORDS } = FUN_FACTS_CONSTANTS;

  const booksEquivalent = Math.round((totalWordCount / HARRY_POTTER_WORDS) * 100) / 100;
  const thesisEquivalent = Math.round((totalWordCount / THESIS_WORDS) * 100) / 100;
  const chouTseEquivalent = Math.round((totalWordCount / CHOU_TSE_WORDS) * 100) / 100;

  const holidayBadges: string[] = [];
  const posts2025 = posts.filter(p => isIn2025(p.creation_timestamp));

  for (const post of posts2025) {
    const date = new Date(post.creation_timestamp * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (month === 12 && (day === 24 || day === 25)) {
      if (!holidayBadges.includes('🎄 聖誕大使')) {
        holidayBadges.push('🎄 聖誕大使');
      }
    }

    if (month === 1 && day === 1) {
      if (!holidayBadges.includes('🎉 新年先鋒')) {
        holidayBadges.push('🎉 新年先鋒');
      }
    }

    if (month === 12 && day === 31) {
      if (!holidayBadges.includes('✨ 跨年戰士')) {
        holidayBadges.push('✨ 跨年戰士');
      }
    }

    if (month === 2 && day === 14) {
      if (!holidayBadges.includes('💕 情人節達人')) {
        holidayBadges.push('💕 情人節達人');
      }
    }

    if (date.getFullYear() === 2025 && month === 1 && day >= 28 && day <= 31) {
      if (!holidayBadges.includes('🧧 新春報喜')) {
        holidayBadges.push('🧧 新春報喜');
      }
    }
  }

  return {
    booksEquivalent,
    thesisEquivalent,
    chouTseEquivalent,
    isHolidayPoster: holidayBadges.length > 0,
    holidayBadges,
  };
}

/**
 * Run the complete analysis pipeline
 * @param data - Parsed threads data
 * @param onProgress - Optional progress callback
 */
export function runAnalysisPipeline(
  data: ParsedThreadsData,
  onProgress?: ProgressCallback,
): RecapAnalysisResult {
  const report = onProgress || (() => {});

  // Step 1: Text analysis
  report('analyzing-text', 20, '正在分析文字內容...');
  const textResult = analyzeTextCore(data.posts);

  // Step 2: Keyword analysis
  report('analyzing-keywords', 40, '正在提取關鍵字...');
  const keywords = analyzeKeywordsCore(data.posts);
  textResult.topKeywords = keywords;

  // Step 3: Time analysis
  report('analyzing-time', 60, '正在分析時間趨勢...');
  const timeResult = analyzeTimeCore(data.posts);

  // Step 4: Social analysis
  report('analyzing-social', 80, '正在統計社群數據...');
  const socialResult = analyzeSocialCore(
    data.followers,
    data.following,
    data.likes,
    data.savedPosts,
  );

  // Step 5: Fun facts
  report('complete', 95, '正在生成趣味數據...');
  const funFacts = calculateFunFactsCore(textResult.totalWordCount, data.posts);

  // Done!
  report('complete', 100, '分析完成！');

  return {
    text: textResult,
    time: timeResult,
    social: socialResult,
    funFacts,
  };
}
