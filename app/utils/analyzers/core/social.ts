import type { ParsedThreadsData, SocialAnalysisResult } from '~/types/threads';
import { isIn2025 } from '../helpers';

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


