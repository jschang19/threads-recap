<template>
  <div>
    <!-- Landing Stage -->
    <RecapLanding
      v-if="appStage === 'landing'"
      @upload-success="handleUploadSuccess"
    />

    <!-- Loading Stage -->
    <LazyRecapLoadingScreen
      v-if="appStage === 'loading'"
      :progress="progress"
    />

    <!-- Recap Stage -->
    <LazyRecapContainer
      v-if="appStage === 'recap'"
    />
  </div>
</template>

<script setup lang="ts">
import type { ParsedThreadsData } from '~/types/threads';
import { toast } from 'vue-sonner';
import { captureException } from '@sentry/nuxt';

const { appStage, setStage, setAnalysisResult, setParsedData, goToPage } = useRecapStore();
const { parseAllFiles } = useFileUpload();
const { analyze, analyzeSync, progress, error: analysisError } = useRecapAnalysis();

async function handleUploadSuccess() {
  beginUploadFlow();
}

// Composable: encapsulate the main upload-analyze flow
async function beginUploadFlow() {
  setStage('loading');
  try {
    const parsedData = await runParseFiles();
    setParsedData(parsedData);
    const result = await runAnalysis(parsedData);
    setAnalysisResult(result);
    // Reset to first page and switch to recap stage
    goToPage(1);
    setStage('recap');
  }
  catch (e) {
    handleUploadError(e);
  }
}

// Step 1: Parse files (returns parsed data, throws on error)
async function runParseFiles() {
  try {
    return await parseAllFiles();
  }
  catch (e) {
    console.error('資料解析失敗:', e);
    throw new Error('資料解析失敗');
  }
}

// Step 2: Run the (possibly worker) analysis, fallback on failure
async function runAnalysis(parsedData: ParsedThreadsData) {
  try {
    return await analyze(parsedData);
  }
  catch (e) {
    console.warn('Web worker failed, falling back to sync analysis:', e);
    return await analyzeSync(parsedData);
  }
}

// Error handler for the upload/analysis process
function handleUploadError(e: unknown) {
  console.error('Analysis failed:', e);
  // Optionally show error to user here
  toast.error(`分析失敗，請重新嘗試: ${e instanceof Error ? e.message : '未知錯誤'}`);
  setStage('landing');
  captureException(e);
}

// Watch for analysis errors (provided by useRecapAnalysis)
watch(analysisError, (error) => {
  if (error) {
    console.error('Analysis error:', error);
    captureException(error);
  }
});
</script>
