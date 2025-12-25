/**
 * Web Worker for running analysis in a background thread
 * Uses shared pipeline from utils/analyzers
 */

import type { ParsedThreadsData, RecapAnalysisResult } from '../types/threads';
import { runAnalysisPipeline, type AnalysisStage } from '../utils/analyzers/pipeline';

// Worker message types
export interface WorkerRequest {
  type: 'analyze';
  data: ParsedThreadsData;
}

export interface WorkerProgressMessage {
  type: 'progress';
  stage: AnalysisStage;
  progress: number;
  message: string;
}

export interface WorkerResultMessage {
  type: 'result';
  data: RecapAnalysisResult;
}

export interface WorkerErrorMessage {
  type: 'error';
  error: string;
}

export type WorkerResponse = WorkerProgressMessage | WorkerResultMessage | WorkerErrorMessage;

/**
 * Send progress update to main thread
 */
function sendProgress(stage: AnalysisStage, progress: number, message: string) {
  self.postMessage({ type: 'progress', stage, progress, message } as WorkerProgressMessage);
}

/**
 * Main message handler
 */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { type, data } = event.data;

  if (type !== 'analyze') {
    self.postMessage({ type: 'error', error: 'Unknown message type' } as WorkerErrorMessage);
    return;
  }

  try {
    // Run the unified analysis pipeline with progress reporting
    const result = runAnalysisPipeline(data, sendProgress);

    self.postMessage({ type: 'result', data: result } as WorkerResultMessage);
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : '分析過程發生錯誤',
    } as WorkerErrorMessage);
  }
};
