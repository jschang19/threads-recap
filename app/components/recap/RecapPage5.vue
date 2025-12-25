<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center space-y-5 max-w-md mx-auto w-full">
      <!-- Title -->
      <Motion
        :initial="{ opacity: 0, y: -30, filter: 'blur(10px)' }"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :transition="{ 
          duration: 0.7, 
          delay: 0.1, 
          type: 'spring',
          stiffness: 100,
          damping: 15
        }"
      >
        <h2 class="text-3xl font-bold">2025 Threads 總結</h2>
      </Motion>

      <!-- Summary Card -->
      <Motion
        :initial="{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(12px)' }"
        :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }"
        :transition="{ 
          duration: 0.8, 
          delay: 0.3, 
          type: 'spring',
          stiffness: 80,
          damping: 18
        }"
      >
        <RecapCard
          :posts-count="result.time.postsIn2025"
          :total-word-count="result.text.totalWordCount"
          :likes-count="result.social.likesIn2025"
          :new-followers-count="result.social.newFollowersIn2025"
          :peak-month-name="peakMonthName"
          :most-active-day="result.time.mostActiveDay"
          :top-mention="topMention"
          :top-keywords="topKeywordsList"
        />
      </Motion>

      <!-- Share CTA -->
      <Motion
        :initial="{ opacity: 0, y: 15, filter: 'blur(6px)' }"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :transition="{ 
          duration: 0.5, 
          delay: 0.7, 
          type: 'spring',
          stiffness: 100,
          damping: 18
        }"
      >
        <div>
          <p class="text-xs text-muted-foreground mb-3">
            截圖分享你的年度回顧吧！
          </p>
        </div>
      </Motion>

      <!-- Holiday Badges -->
      <div
        v-if="result.funFacts.holidayBadges.length > 0"
        class="space-y-3 pt-4"
      >
        <Motion
          :initial="{ opacity: 0, y: -20, filter: 'blur(8px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :transition="{ 
            duration: 0.6, 
            delay: 1.4, 
            type: 'spring',
            stiffness: 100,
            damping: 15
          }"
        >
          <h3 class="text-lg font-semibold">獲得的勳章</h3>
        </Motion>
        <div class="flex flex-wrap justify-center gap-2">
          <Motion
            v-for="(badge, index) in result.funFacts.holidayBadges"
            :key="badge"
            :initial="{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }"
            :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
            :transition="{ 
              duration: 0.4, 
              delay: 1.4 + index * 0.1, 
              type: 'spring',
              stiffness: 150,
              damping: 12
            }"
          >
            <span
              class="px-4 py-2 bg-muted rounded-full text-sm font-medium"
            >
              {{ badge }}
            </span>
          </Motion>
        </div>
      </div>

      <!-- Thank You Message -->
      <Motion
        :initial="{ opacity: 0, y: 20, filter: 'blur(6px)' }"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :transition="{ 
          duration: 0.6, 
          delay: 2.4, 
          type: 'spring',
          stiffness: 100,
          damping: 20
        }"
      >
        <div class="pt-4 text-muted-foreground">
          <p class="text-sm">
            感謝一起回顧這一年在 Threads 上的各種回憶
          </p>
          <p class="text-sm mt-2 text-muted-foreground">
            2025 一路走好，2026 請多指教！
          </p>
        </div>
      </Motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import type { RecapAnalysisResult } from '~/types/threads';
import { RecapCard } from '~/components/recap';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const peakMonthName = computed(() => {
  return MONTH_NAMES[props.result.time.mostActiveMonth - 1] || '';
});

const topMention = computed(() => {
  return props.result.text.topMentions[0]?.username || null;
});

const topKeywordsList = computed(() => {
  return props.result.text.topKeywords.map(k => k.keyword);
});
</script>
