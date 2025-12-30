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
    setStage('landing');
    handleUploadError(e);
  }
}

// Step 1: Parse files (returns parsed data, throws on error)
async function runParseFiles() {
  try {
    return await parseAllFiles();
  }
  catch (e) {
    console.error('data parsing failed:', e);
    throw new Error(
      `data parsing failed: ${e instanceof Error ? e.message : String(e)}`,
    );
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
  console.error('Upload failed:', e);
  // Optionally show error to user here
  toast.error('出現一點問題，請刷新頁面重新上傳', {
    description: e instanceof Error ? e.message : '未知錯誤',
    action: {
      label: '重新整理',
      onClick: () => window.location.reload(),
    },
  });
}

// Watch for analysis errors (provided by useRecapAnalysis)
watch(analysisError, (error) => {
  if (error) {
    console.error('analysis error:', error);
    toast.error('分析出現一點問題', {
      description: error,
      action: {
        label: '重新整理',
        onClick: () => window.location.reload(),
      },
    });
  }
});
</script>
