/**
 * Shared constants for analyzers
 * These are used by both main thread analyzers and web worker
 */


export const YEAR_2025_START = new Date('2025-01-01T00:00:00Z').getTime() / 1000;
export const YEAR_2025_END = new Date('2025-12-31T23:59:59Z').getTime() / 1000;

// Unicode keys for saved_threads.json (Traditional Chinese)
export const SAVED_POST_KEYS = {
  AUTHOR: '\u00e4\u00bd\u009c\u00e8\u0080\u0085', // 作者
  SAVED_TIME: '\u00e5\u0084\u00b2\u00e5\u00ad\u0098\u00e6\u0099\u0082\u00e9\u0096\u0093', // 儲存時間
} as const;

/**
 * Stop words to filter out (common Chinese/English words)
 * Used by keyword analyzer
 */
export const STOP_WORDS = new Set([
  // Chinese stop words
  '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一個',
  '上', '也', '很', '到', '說', '要', '去', '你', '會', '著', '沒有', '看', '好',
  '自己', '這', '那', '這個', '那個', '什麼', '怎麼', '為什麼', '可以', '因為',
  '如果', '但是', '所以', '還是', '已經', '現在', '真的', '覺得', '知道', '應該',
  '他', '她', '它', '們', '嗎', '吧', '啊', '呢', '喔', '欸', '哈', '哈哈',
  // English stop words
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'been', 'being', 'and', 'but', 'if', 'or', 'because', 'as',
  'until', 'while', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out',
  'off', 'over', 'under', 'again', 'further', 'then', 'once',
  // Common URLs and social media terms to filter
  'http', 'https', 'www', 'com', 'threads', 'instagram',
]);

/**
 * Month names in Chinese (0-indexed)
 */
export const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];


export const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/**
 * Day names in Chinese (0-indexed, Sunday = 0)
 */
export const DAY_NAMES = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

/**
 * Fun facts calculation constants
 */
export const FUN_FACTS_CONSTANTS = {
  HARRY_POTTER_WORDS: 1084170, // Harry Potter (Philosopher's Stone) word count
  THESIS_WORDS: 15000, // Average thesis word count
  CHOU_TSE_WORDS: 700, // CHOU TSE word count (出師表)
};


export const LINKS = {
  TUTORIAL: 'https://reurl.cc/KOqXd9',
  REPO: 'https://github.com/jschang19/threads-recap',
};

export const MOCK_DEMO_DATA = {
  postsCount: 365,
  totalWordCount: 28420,
  likesCount: 1034,
  newFollowersCount: 89,
  peakMonthName: '九月',
  mostActiveDay: '星期五',
  topMention: 'zuck',
  topKeywords: ['單身', '感情', '爛台大'],
};

// const title = 'Threads 2025 年度總回顧 - Threadseeker';
// const description
//   = '用 Threadseeker Recap 來建立你的 threads.com 2025 年度回顧紀錄！幫你分析這一整年在脆的發文紀錄與數據，還有最常提及的朋友與打的關鍵字。';
// const keywords = 'threads';
// const ogImagePath = '/images/banner.webp';

export const SEO_CONFIG = {
  title: 'Threads 2025 年度總回顧 - Threadseeker',
  description: '用 Threadseeker Recap 來建立你的 threads.com 2025 年度回顧紀錄！幫你分析這一整年在脆的發文紀錄與數據，還有最常提及的朋友與打的關鍵字。',
  keywords: 'threads',
  ogImagePath: '/images/banner.webp',
};