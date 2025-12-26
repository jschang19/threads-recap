import type {
  ParsedThreadsData,
  RecapAnalysisResult,
  AnalysisProgress,
} from '~/types/threads';
import type {
  WorkerRequest,
  WorkerResponse,
} from '~/workers/analyzer.worker';
import { runAnalysisPipeline, type AnalysisStage } from '~/utils/analyzers/pipeline';

export function useRecapAnalysis() {
  const isAnalyzing = ref(false);
  const progress = ref<AnalysisProgress>({
    stage: 'parsing',
    progress: 0,
    message: '',
  });
  const result = ref<RecapAnalysisResult | null>(null);
  const error = ref<string | null>(null);

  let worker: Worker | null = null;

  /**
   * Initialize the web worker
   */
  function initWorker(): Worker {
    if (worker) {
      worker.terminate();
    }

    // Create worker using Vite's worker import
    worker = new Worker(
      new URL('../workers/analyzer.worker.ts', import.meta.url),
      { type: 'module' },
    );

    return worker;
  }

  /**
   * Map analysis stage to progress stage (normalize keyword stage)
   */
  function mapStage(stage: AnalysisStage): AnalysisProgress['stage'] {
    return stage === 'analyzing-keywords' ? 'analyzing-text' : stage;
  }

  /**
   * Reset state before starting analysis
   */
  function resetAnalysisState() {
    isAnalyzing.value = true;
    error.value = null;
    result.value = null;
    progress.value = {
      stage: 'parsing',
      progress: 0,
      message: '正在準備分析...',
    };
  }

  /**
   * Handle successful analysis completion
   */
  function handleAnalysisComplete(analysisResult: RecapAnalysisResult) {
    result.value = analysisResult;
    isAnalyzing.value = false;
  }

  /**
   * Handle analysis error
   */
  function handleAnalysisError(errorMessage: string): Error {
    error.value = errorMessage;
    isAnalyzing.value = false;
    return new Error(errorMessage);
  }

  /**
   * Run analysis on parsed data using web worker
   */
  async function analyze(data: ParsedThreadsData): Promise<RecapAnalysisResult> {
    return new Promise((resolve, reject) => {
      resetAnalysisState();

      try {
        const w = initWorker();

        w.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const response = event.data;

          if (response.type === 'progress') {
            progress.value = {
              stage: mapStage(response.stage),
              progress: response.progress,
              message: response.message,
            };
          }
          else if (response.type === 'result') {
            handleAnalysisComplete(response.data);
            resolve(response.data);
          }
          else if (response.type === 'error') {
            reject(handleAnalysisError(response.error));
          }
        };

        w.onerror = (event) => {
          reject(handleAnalysisError(event.message || '分析過程發生錯誤'));
        };

        // Send data to worker
        const request: WorkerRequest = {
          type: 'analyze',
          data,
        };
        w.postMessage(request);
      }
      catch (e) {
        const errorMessage = e instanceof Error ? e.message : '無法啟動分析程序';
        reject(handleAnalysisError(errorMessage));
      }
    });
  }

  /**
   * Run analysis without web worker (fallback)
   * Uses the same pipeline as the worker for consistency
   */
  async function analyzeSync(data: ParsedThreadsData): Promise<RecapAnalysisResult> {
    resetAnalysisState();

    try {
      // Run the unified pipeline with progress callback
      const analysisResult = runAnalysisPipeline(data, (stage, progressValue, message) => {
        progress.value = {
          stage: mapStage(stage),
          progress: progressValue,
          message,
        };
      });

      handleAnalysisComplete(analysisResult);
      return analysisResult;
    }
    catch (e) {
      const errorMessage = e instanceof Error ? e.message : '分析過程發生錯誤';
      throw handleAnalysisError(errorMessage);
    }
  }

  /**
   * Reset analysis state
   */
  function reset() {
    if (worker) {
      worker.terminate();
      worker = null;
    }
    isAnalyzing.value = false;
    progress.value = { stage: 'parsing', progress: 0, message: '' };
    result.value = null;
    error.value = null;
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  });

  return {
    isAnalyzing: readonly(isAnalyzing),
    progress: readonly(progress),
    result: readonly(result),
    error: readonly(error),
    analyze,
    analyzeSync,
    reset,
  };
}
