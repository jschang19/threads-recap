<template>
  <div class="min-h-[75vh] flex flex-col items-center justify-center px-4 pb-8">
    <div class="text-center space-y-8 max-w-lg mx-auto w-full flex-1">
      <!-- Title -->
      <div class="space-y-2 pt-22 md:pt-6">
        <MotionBox
          preset="fadeDown"
          :delay="0.1"
        >
          <h2 class="text-3xl font-bold leading-13">
            <span class="text-lg font-normal text-muted-foreground">如果在 Threads 打一個字拿一塊</span><br>你今年可以拿到
          </h2>
        </MotionBox>
      </div>

      <!-- Word Count -->
      <div class="space-y-4">
        <MotionBox
          preset="fadeScale"
          :delay="1.3"
          :stiffness="80"
        >
          <div class="relative inline-block">
            <span class="text-7xl sm:text-8xl font-black tracking-tighter">
              <RowValue :value="formattedCount" />
              <span class="text-xl text-muted-foreground font-normal ml-3">元</span>
            </span>
          </div>
        </MotionBox>
      </div>

      <!-- Fun Equivalents -->
      <div class="py-10 space-y-4">
        <MotionBox
          preset="fadeUp"
          :delay="2.3"
        >
          <h3 class="text-lg font-semibold">
            你今年打的字數等於
          </h3>
        </MotionBox>
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <MotionBox
            preset="card"
            :delay="2.4"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">
                {{ formatFixedCount(result.funFacts.chouTseEquivalent) }}
              </p>
              <p class="text-muted-foreground">
                篇出師表
              </p>
            </div>
          </MotionBox>
          <MotionBox
            preset="card"
            :delay="2.5"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">
                {{ formatFixedCount(result.funFacts.thesisEquivalent) }}
              </p>
              <p class="text-muted-foreground">
                篇碩論
              </p>
            </div>
          </MotionBox>
          <MotionBox
            preset="card"
            :delay="2.6"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">
                {{ formatFixedCount(result.funFacts.booksEquivalent) }}
              </p>
              <p class="text-muted-foreground">
                本哈利波特
              </p>
            </div>
          </MotionBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { animate, useMotionValue, useTransform, RowValue } from 'motion-v';
import { MotionBox } from '~/components/ui/motion-box';
import type { RecapAnalysisResult } from '~/types/threads';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

// Animated counter for totalWordCount
const count = useMotionValue(0);
const formattedCount = useTransform(() => Math.round(count.get()).toLocaleString('zh-TW'));

let controls: ReturnType<typeof animate> | undefined;

onMounted(() => {
  // Animate from 0 to totalWordCount with a nice duration
  controls = animate(count, props.result.text.totalWordCount, {
    duration: 2,
    ease: [0.25, 0.1, 0.25, 1], // cubic-bezier easing for smooth counting
  });
});

onUnmounted(() => {
  controls?.stop();
});

function formatFixedCount(count: number) {
  return count.toFixed(2);
}
</script>
