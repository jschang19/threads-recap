import type { FunFacts } from '~/types/threads';
import { FUN_FACTS_CONSTANTS } from '~/constants';
import { isIn2025 } from '../helpers';

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


