<template>
  <div class="min-h-[80vh] flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div class="max-w-2xl mx-auto space-y-8 h-full flex flex-col justify-center">
        <LandingHero @open-upload="showUploadDialog = true" />
        <LandingDemoCard />
      </div>
    </section>

    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <LandingHowItWork :steps="steps" />
        <LandingEndTutorial />
      </div>
    </section>

    <!-- Upload Dialog -->
    <UploadDialog
      v-model:open="showUploadDialog"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { UploadDialog } from '~/components/recap';
import LandingHero from './components/landing-hero.vue';
import LandingDemoCard from './components/landing-demo-card.vue';
import LandingHowItWork from './components/landing-how-it-work.vue';
import LandingEndTutorial from './components/landing-end-tutorial.vue';

const emit = defineEmits<{
  (e: 'upload-success'): void;
}>();

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

function handleUploadSuccess() {
  showUploadDialog.value = false;
  emit('upload-success');
}
</script>

