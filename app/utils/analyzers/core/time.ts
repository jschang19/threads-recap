import type { ParsedThreadsData, TimeAnalysisResult } from '~/types/threads';
import { DAY_NAMES } from '~/constants';
import { isIn2025 } from '../helpers';

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
