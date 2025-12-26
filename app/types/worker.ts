import type { ParsedThreadsData, RecapAnalysisResult } from '~/types/threads';
import type { AnalysisStage } from '~/types/pipeline';

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
