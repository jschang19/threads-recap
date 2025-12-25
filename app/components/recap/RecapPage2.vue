<template>
  <div class="flex flex-col items-center justify-center px-4 pb-8">
    <BlurBackground />
    <div class="text-center space-y-8 max-w-lg mx-auto w-full flex-1">
      <!-- Title -->
      <div class="space-y-2 pt-24 md:pt-6">
        <Motion
          :initial="{ opacity: 0, y: -30, filter: 'blur(10px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'none' }"
          :transition="{ 
            duration: 0.7, 
            delay: 0.1, 
            type: 'spring',
            stiffness: 100,
            damping: 15
          }"
        >
          <h2 class="text-3xl font-bold leading-13"><span class="text-lg font-normal text-muted-foreground">如果在 Threads 打一個字拿一塊</span><br />你今年可以拿到</h2>
        </Motion>
      </div>

      <!-- Word Count -->
      <div class="space-y-4">
        <Motion
          :initial="{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'none' }"
          :transition="{ 
            duration: 0.7, 
            delay: 1.3, 
            type: 'spring',
            stiffness: 80,
            damping: 18
          }"
        >
          <div class="relative inline-block">
            <span class="text-7xl sm:text-8xl font-black tracking-tighter">
              <RowValue :value="formattedCount" />
              <span class="text-xl text-muted-foreground font-normal ml-3">元</span>
            </span>
          </div>
        </Motion>
      </div>

      <!-- Fun Equivalents -->
      <div class="py-10 space-y-4">
        <Motion
          :initial="{ opacity: 0, y: 20, filter: 'blur(8px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'none'  }"
          :transition="{ 
            duration: 0.6, 
            delay: 2.3, 
            type: 'spring',
            stiffness: 100,
            damping: 18
          }"
        >
          <h3 class="text-lg font-semibold">你今年打的字數等於</h3>
        </Motion>
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <Motion
            :initial="{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }"
            :animate="{ opacity: 1, y: 0, scale: 1, filter: 'none' }"
            :transition="{ 
              duration: 0.5, 
              delay: 2.4, 
              type: 'spring',
              stiffness: 120,
              damping: 15
            }"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">{{ result.funFacts.chouTseEquivalent.toFixed(2) }}</p>
              <p class="text-muted-foreground">篇出師表</p>
            </div>
          </Motion>
          <Motion
            :initial="{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }"
            :animate="{ opacity: 1, y: 0, scale: 1, filter: 'none' }"
            :transition="{ 
              duration: 0.5, 
              delay: 2.5, 
              type: 'spring',
              stiffness: 120,
              damping: 15
            }"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">{{ result.funFacts.thesisEquivalent.toFixed(2) }}</p>
              <p class="text-muted-foreground">篇碩論</p>
            </div>
          </Motion>
          <Motion
            :initial="{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }"
            :animate="{ opacity: 1, y: 0, scale: 1, filter: 'none' }"
            :transition="{ 
              duration: 0.5, 
              delay: 2.6, 
              type: 'spring',
              stiffness: 120,
              damping: 15
            }"
          >
            <div class="p-4 rounded-xl bg-muted">
              <p class="text-2xl font-bold">{{ result.funFacts.booksEquivalent.toFixed(2) }}</p>
              <p class="text-muted-foreground">本哈利波特</p>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Motion, animate, useMotionValue, useTransform, RowValue } from 'motion-v';
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
    ease: [0.25, 0.1, 0.25, 1] // cubic-bezier easing for smooth counting
  });
});

onUnmounted(() => {
  controls?.stop();
});
</script>

