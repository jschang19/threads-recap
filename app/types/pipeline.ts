export type AnalysisStage = 'parsing' | 'analyzing-text' | 'analyzing-keywords' | 'analyzing-time' | 'analyzing-social' | 'complete';

export interface ProgressCallback {
  (stage: AnalysisStage, progress: number, message: string): void;
}
