// ============================================
// Raw JSON Schema Types (from Threads export)
// ============================================

// threads_and_replies.json
export interface CameraMetadata {
  has_camera_metadata: boolean;
}

export interface MediaMetadata {
  camera_metadata: CameraMetadata;
}

export interface CrossPostSource {
  source_app: string;
}

export interface TextAppPost {
  reply_control: 'everyone' | 'accounts_you_follow' | 'mentioned_only' | string;
  geo_gated_country_list: string;
}

export interface ThreadPostMedia {
  uri: string;
  creation_timestamp: number;
  media_metadata: MediaMetadata;
  title: string;
  cross_post_source?: CrossPostSource;
  text_app_post: TextAppPost;
}

export interface ThreadsAndRepliesResponse {
  text_post_app_text_posts: [
    {
      media: ThreadPostMedia[];
      title?: string;
      creation_timestamp?: number;
    }
  ];
}

// followers.json & following.json
export interface ThreadUserData {
  href: string;
  value: string;
  timestamp: number;
}

export interface ThreadFollowItem {
  title: string;
  string_list_data: ThreadUserData[];
}

export interface ThreadFollowersResponse {
  text_post_app_text_post_app_followers: ThreadFollowItem[];
}

export interface ThreadFollowingResponse {
  text_post_app_text_post_app_following: ThreadFollowItem[];
}

// liked_threads.json
export interface LikeStringData {
  href: string;
  value: string;
  timestamp: number;
}

export interface ThreadLikedPost {
  title: string;
  media_list_data: unknown[];
  string_list_data: LikeStringData[];
}

export interface ThreadLikesResponse {
  text_post_app_media_likes: ThreadLikedPost[];
}

// saved_threads.json
export interface SavedPostDetail {
  href: string;
  value: string;
  timestamp: number;
}

export interface ThreadSavedPost {
  title: string;
  media_map_data: Record<string, unknown>;
  string_map_data: {
    [key: string]: SavedPostDetail;
  };
}

export interface ThreadSavedPostsResponse {
  text_post_app_text_post_app_saved_posts: ThreadSavedPost[];
}

// ============================================
// Parsed/Processed Data Types
// ============================================

export interface ParsedThreadsData {
  posts: {
    media: ThreadPostMedia[];
    title: string;
    creation_timestamp: number;
  }[];
  followers: ThreadFollowItem[];
  following: ThreadFollowItem[];
  likes: ThreadLikedPost[];
  savedPosts: ThreadSavedPost[];
}

// ============================================
// Analysis Result Types
// ============================================

export interface MentionCount {
  username: string;
  count: number;
}

export interface KeywordCount {
  keyword: string;
  count: number;
}

export interface MonthlyStats {
  month: number; // 1-12
  year: number;
  postCount: number;
  followerGain: number;
}

export interface HeatmapCell {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  month: number; // 0-11
  count: number;
}

export interface TextAnalysisResult {
  totalPosts: number;
  totalWordCount: number;
  totalCharCount: number;
  averageWordsPerPost: number;
  topMentions: MentionCount[];
  topKeywords: KeywordCount[];
}

export interface TimeAnalysisResult {
  monthlyStats: MonthlyStats[];
  heatmapData: HeatmapCell[];
  mostActiveMonth: number;
  mostActiveDay: string;
  postsIn2025: number;
}

export interface SocialAnalysisResult {
  totalFollowers: number;
  newFollowersIn2025: number;
  totalFollowing: number;
  newFollowingIn2025: number;
  totalLikes: number;
  likesIn2025: number;
  totalSaved: number;
  savedIn2025: number;
  followerGrowthByMonth: { month: number; cumulative: number }[];
}

export interface RecapAnalysisResult {
  text: TextAnalysisResult;
  time: TimeAnalysisResult;
  social: SocialAnalysisResult;
  funFacts: FunFacts;
}

export interface FunFacts {
  booksEquivalent: number; // Word count converted to Harry Potter books
  thesisEquivalent: number; // Word count converted to thesis papers
  chouTseEquivalent: number; // Word count converted to CHOU TSE
  isHolidayPoster: boolean; // Posted on Christmas/New Year
  holidayBadges: string[];
}

// ============================================
// File Upload Types
// ============================================

export interface FileValidationResult {
  isValid: boolean;
  missingFiles: string[];
  foundFiles: string[];
  errors: string[];
}

export interface UploadedFiles {
  threadsAndReplies?: File;
  followers?: File;
  following?: File;
  likedThreads?: File;
  savedThreads?: File;
}

// ============================================
// App State Types
// ============================================

export type AppStage = 'landing' | 'upload' | 'loading' | 'recap';

export interface AnalysisProgress {
  stage: 'parsing' | 'analyzing-text' | 'analyzing-time' | 'analyzing-social' | 'complete';
  progress: number; // 0-100
  message: string;
}

// ============================================
// Constants
// ============================================

export const REQUIRED_FILES = [
  'threads_and_replies.json',
  'followers.json',
  'following.json',
  'liked_threads.json',
  'saved_threads.json',
] as const;

export const YEAR_2025_START = new Date("2025-01-01T00:00:00Z").getTime() / 1000;
export const YEAR_2025_END = new Date("2025-12-31T23:59:59Z").getTime() / 1000;

// Unicode keys for saved_threads.json (Traditional Chinese)
export const SAVED_POST_KEYS = {
  AUTHOR: '\u00e4\u00bd\u009c\u00e8\u0080\u0085', // 作者
  SAVED_TIME: '\u00e5\u0084\u00b2\u00e5\u00ad\u0098\u00e6\u0099\u0082\u00e9\u0096\u0093', // 儲存時間
} as const;

