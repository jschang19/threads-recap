/**
 * Unified analysis pipeline
 * Orchestrates all analyzers in a consistent flow
 * Used by both web worker and sync fallback
 */

import type {
  ParsedThreadsData,
  RecapAnalysisResult,
} from '~/types/threads';
import type { ProgressCallback } from '~/types/pipeline';
import { analyzeKeywordsCore } from './core/keywords';
import { calculateFunFactsCore } from './core/fun-facts';
import { analyzeSocialCore } from './core/social';
import { analyzeTextCore } from './core/text';
import { analyzeTimeCore } from './core/time';


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
