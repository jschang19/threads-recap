/**
 * Shared constants for analyzers
 * These are used by both main thread analyzers and web worker
 */

// Re-export time constants from types
export { YEAR_2025_START, YEAR_2025_END, SAVED_POST_KEYS } from '../../types/threads';

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
