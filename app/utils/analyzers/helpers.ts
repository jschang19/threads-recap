/**
 * Shared helper functions for analyzers
 * These are used by both main thread analyzers and web worker
 */

import { YEAR_2025_START, YEAR_2025_END } from '~/types/threads';

/**
 * Check if a timestamp is in 2025
 */
export function isIn2025(timestamp: number): boolean 
{
  return timestamp >= YEAR_2025_START && timestamp <= YEAR_2025_END;
}

/**
 * Count words in text using Intl.Segmenter for accurate CJK support
 */
export function countWords(text: string): number {
  if (!text || text.trim() === '') return 0;

  try {
    // Use Intl.Segmenter for accurate word segmentation
    const segmenter = new Intl.Segmenter('zh-Hant', { granularity: 'word' });
    const segments = Array.from(segmenter.segment(text));

    // Count only word-like segments (not punctuation or whitespace)
    return segments.filter(segment => segment.isWordLike).length;
  } catch {
    // Fallback for browsers without Intl.Segmenter support
    const cjkPattern = /[\u4e00-\u9fff\u3400-\u4dbf]/g;
    const cjkChars = text.match(cjkPattern) || [];
    const nonCjkText = text.replace(cjkPattern, ' ');
    const words = nonCjkText.split(/\s+/).filter(w => w.length > 0);

    return cjkChars.length + words.length;
  }
}

/**
 * Count characters in text (excluding whitespace)
 */
export function countCharacters(text: string): number {
  if (!text) return 0;
  return text.replace(/\s/g, '').length;
}

/**
 * Extract @mentions from text
 */
export function extractMentions(text: string): string[] {
  if (!text) return [];

  // Match @username patterns
  // Username can contain letters, numbers, underscores, and periods
  const mentionPattern = /@([a-zA-Z0-9._]+)/g;
  const matches = text.matchAll(mentionPattern);

  return Array.from(matches, match => match[1])
    .filter((username): username is string => {
      return typeof username === 'string' && username.length >= 2 && !/^\d+$/.test(username);
    });
}


/**
 * Simple text segmentation using Intl.Segmenter
 * Falls back to regex-based extraction if not supported
 */
export function simpleSegment(text: string): string[] {
  try {
    const segmenter = new Intl.Segmenter('zh-Hant', { granularity: 'word' });
    const segments = Array.from(segmenter.segment(text));
    return segments.filter(s => s.isWordLike).map(s => s.segment);
  } catch {
    // Fallback: extract CJK and English words
    const cjkPattern = /[\u4e00-\u9fff\u3400-\u4dbf]+/g;
    const nonCjkPattern = /[a-zA-Z]+/g;
    const cjkMatches = text.match(cjkPattern) || [];
    const nonCjkMatches = text.match(nonCjkPattern) || [];
    return [...cjkMatches, ...nonCjkMatches];
  }
}

