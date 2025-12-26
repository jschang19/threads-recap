import type { AppStage, RecapAnalysisResult, ParsedThreadsData } from '~/types/threads';

// Create a global state that persists across components
const appStage = ref<AppStage>('landing');
const analysisResult = ref<RecapAnalysisResult | null>(null);
const parsedData = ref<ParsedThreadsData | null>(null);
const currentRecapPage = ref(1);
const totalRecapPages = 7;

export function useRecapStore() {
  /**
   * Set the current app stage
   */
  function setStage(stage: AppStage) {
    appStage.value = stage;
  }

  /**
   * Store analysis results
   */
  function setAnalysisResult(result: RecapAnalysisResult) {
    analysisResult.value = result;
  }

  /**
   * Store parsed data
   */
  function setParsedData(data: ParsedThreadsData) {
    parsedData.value = data;
  }

  /**
   * Navigate to next recap page
   */
  function nextPage() {
    if (currentRecapPage.value < totalRecapPages) {
      currentRecapPage.value++;
    }
  }

  /**
   * Navigate to previous recap page
   */
  function prevPage() {
    if (currentRecapPage.value > 1) {
      currentRecapPage.value--;
    }
  }

  /**
   * Go to a specific recap page
   */
  function goToPage(page: number) {
    if (page >= 1 && page <= totalRecapPages) {
      currentRecapPage.value = page;
    }
  }

  /**
   * Reset all state
   */
  function reset() {
    appStage.value = 'landing';
    analysisResult.value = null;
    parsedData.value = null;
    currentRecapPage.value = 1;
  }

  /**
   * Check if we can go to the next page
   */
  const canGoNext = computed(() => currentRecapPage.value < totalRecapPages);

  /**
   * Check if we can go to the previous page
   */
  const canGoPrev = computed(() => currentRecapPage.value > 1);

  return {
    // State
    appStage: readonly(appStage),
    analysisResult: analysisResult,
    parsedData: readonly(parsedData),
    currentRecapPage: readonly(currentRecapPage),
    totalRecapPages,

    // Computed
    canGoNext,
    canGoPrev,

    // Actions
    setStage,
    setAnalysisResult,
    setParsedData,
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
}
