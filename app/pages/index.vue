<template>
  <div>
    <!-- Landing Stage -->
    <div
      v-if="appStage === 'landing'"
      class="min-h-[80vh] flex flex-col"
    >
      <!-- Hero Section -->
      <section class="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div class="max-w-2xl mx-auto space-y-8 h-full flex flex-col justify-center">

        <div class="flex flex-col justify-center items-center space-y-8 h-[calc(50dvh)] md:h-[calc(42dvh)]">
          <div class="space-y-4">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-md text-sm">
              <Flag class="size-4" />
              <span>非 Threads 官方網站</span>
            </div>
          </div>
          <!-- Title -->
          <div class="space-y-4">
            <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight">
              你的 Threads 年度回顧
            </h1>
            <p class="text-xl sm:text-2xl text-muted-foreground">
              深入回顧 2025 年的活網黑歷史
            </p>
          </div>

          <!-- CTA Button -->
          <div class="pt-3 space-y-2 flex flex-col items-center justify-center">
            <Button
              size="lg"
              class="text-base px-8 py-6 rounded-md h-12 w-full max-w-sm mx-auto"
              @click="showUploadDialog = true"
            >
              開始回顧
            </Button>
            <Button
              size="sm"
              variant="outline"
              as="a"
              class="px-4 py-2 rounded-md h-12 text-base w-full max-w-sm mx-auto shadow-none"
              href="https://reurl.cc/KOqXd9"
              target="_blank"
              rel="noopener noreferrer"
            >
              看教學
              <ExternalLink class="w-4 h-4" />
            </Button>
            <span class="text-xs text-muted-foreground">只在手機或電腦執行分析，紀錄不會上傳伺服器 | <a href="https://github.com/jschang19/threads-recap" target="_blank" rel="noopener noreferrer" class="hover:underline">如何確認？</a></span>
          </div>
        </div>


          <!-- Demo Card -->
          <div class="pt-12 w-full max-w-sm mx-auto">
            <h2 class="text-2xl font-bold text-center mb-4">像 Spotify 一樣的年度回顧</h2>
            <div class="opacity-90 hover:opacity-100 transition-opacity">
              <RecapCard
                :posts-count="mockDemoData.postsCount"
                :total-word-count="mockDemoData.totalWordCount"
                :likes-count="mockDemoData.likesCount"
                :new-followers-count="mockDemoData.newFollowersCount"
                :peak-month-name="mockDemoData.peakMonthName"
                :most-active-day="mockDemoData.mostActiveDay"
                :top-mention="mockDemoData.topMention"
                :top-keywords="mockDemoData.topKeywords"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- How it works Section -->
      <section class="py-12 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-center mb-8">如何開始？</h2>
          
          <div class="grid md:grid-cols-4 gap-6">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="text-center space-y-3"
            >
              <div class="w-12 h-12 mx-auto rounded-full bg-foreground text-background flex items-center justify-center text-lg font-bold">
                {{ index + 1 }}
              </div>
              <h3 class="font-semibold">{{ step.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ step.description }}</p>
            </div>
          </div>

          <div class="mt-8 p-4 rounded-xl bg-muted text-center">
            <p class="text-sm text-muted-foreground mb-2">還沒有匯出資料？有教學！</p>
            <a
              href="https://reurl.cc/KOqXd9"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              作者寫的手把手教學
              <ExternalLink class="w-4 h-4" />
            </a>
          
          </div>
        </div>
      </section>

    </div>

    <!-- Loading Stage -->
    <LoadingScreen
      v-else-if="appStage === 'loading'"
      :progress="progress"
    />

    <!-- Recap Stage -->
    <RecapContainer v-else-if="appStage === 'recap'" />
        <!-- Upload Dialog -->
    <UploadDialog
      v-if="appStage === 'landing'"
      v-model:open="showUploadDialog"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Flag, ExternalLink } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { UploadDialog, LoadingScreen, RecapContainer, RecapCard } from '~/components/recap';
import type { ParsedThreadsData } from '~/types/threads';
import { toast } from 'vue-sonner';

// Mock data for the demo card
const mockDemoData = {
  postsCount: 365,
  totalWordCount: 28420,
  likesCount: 1034,
  newFollowersCount: 89,
  peakMonthName: '九月',
  mostActiveDay: '星期五',
  topMention: 'zuck',
  topKeywords: ['單身', '感情', '爛台大'],
};

const { appStage, setStage, setAnalysisResult, setParsedData, goToPage } = useRecapStore();
const { parseAllFiles } = useFileUpload();
const { analyze, analyzeSync, progress, error: analysisError } = useRecapAnalysis();

const showUploadDialog = ref(false);

const steps = [
  {
    title: '下載資料',
    description: '從 Meta 帳號中心下載你的 Threads 資料',
  },
  {
    title: '解壓縮',
    description: '將下載的 ZIP 檔案解壓縮',
  },
  {
    title: '上傳資料夾',
    description: '選擇解壓縮後的資料夾',
  },
  {
    title: '查看回顧',
    description: '享受你的 2025 年度回顧！',
  },
];

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
  } catch (e) {
    handleUploadError(e);
  }
}

// Step 1: Parse files (returns parsed data, throws on error)
async function runParseFiles() {
  try {
    return await parseAllFiles();
  } catch (e) {
    console.error('資料解析失敗:', e);
    throw new Error('資料解析失敗');
  }
}

// Step 2: Run the (possibly worker) analysis, fallback on failure
async function runAnalysis(parsedData: ParsedThreadsData) {
  try {
    return await analyze(parsedData);
  } catch (e) {
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
}

// Watch for analysis errors (provided by useRecapAnalysis)
watch(analysisError, (error) => {
  if (error) {
    console.error('Analysis error:', error);
  }
});
</script>
