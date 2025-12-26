<template>
  <div class="min-h-[68vh] flex flex-col items-center justify-center px-4 pt-8">
    <div class="text-center space-y-4 max-w-md mx-auto w-full">
      <!-- Title -->
      <MotionBox
        preset="fadeDown"
        :delay="0.1"
      >
        <h2 class="text-3xl font-bold">
          2025 Threads 總結
        </h2>
      </MotionBox>

      <!-- Summary Card -->
      <MotionBox
        preset="hero"
        :delay="0.3"
        :slide-y="40"
        :scale="0.95"
        :blur="12"
      >
        <div class="flex justify-center items-center">
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
        </div>
      </MotionBox>

      <!-- Share CTA -->
      <MotionBox
        preset="fadeUp"
        :delay="0.7"
        :slide-y="15"
        :blur="6"
      >
        <div>
          <p class="text-xs text-muted-foreground">
            截圖分享你的年度回顧吧！
          </p>
        </div>
      </MotionBox>

      <!-- Holiday Badges (Temporary disabled before better UI) -->
      <div
        v-if="false"
        class="space-y-3 pt-4"
      >
        <MotionBox
          preset="fadeDown"
          :delay="1.4"
          :slide-y="-20"
          :blur="8"
        >
          <h3 class="text-lg font-semibold">
            獲得的勳章
          </h3>
        </MotionBox>
        <div class="flex flex-wrap justify-center gap-2">
          <MotionBox
            v-for="(badge, index) in result.funFacts.holidayBadges"
            :key="badge"
            preset="fadeScale"
            :delay="1.4 + index * 0.1"
            :duration="0.4"
            :scale="0.8"
            :blur="6"
            :stiffness="150"
            :damping="12"
          >
            <span
              class="px-4 py-2 bg-muted rounded-full text-sm font-medium"
            >
              {{ badge }}
            </span>
          </MotionBox>
        </div>
      </div>

      <!-- Thank You Message -->
      <MotionBox
        preset="fadeUp"
        :delay="1.7"
        :damping="20"
      >
        <div class="pt-4 text-muted-foreground">
          <p class="text-sm">
            感謝一起回顧這一年在 Threads 上的各種回憶
          </p>
          <p class="text-sm mt-2 text-muted-foreground">
            2025 一路走好，2026 請多指教！
          </p>
        </div>
      </MotionBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecapCard from '~/components/recap/recap-card.vue';
import { MotionBox } from '~/components/ui/motion-box';
import type { RecapAnalysisResult } from '~/types/threads';
import { MONTH_NAMES } from '~/constants';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

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
