<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-8">
    <div class="text-center space-y-8 max-w-lg mx-auto w-full">
      <!-- Top Mentions -->
      <div
        v-if="result.text.topMentions.length > 0"
        class="space-y-4"
      >
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
          <h3 class="text-2xl font-semibold">你最常 @ 這些人</h3>
        </Motion>
        <div class="flex flex-wrap justify-center gap-3">
          <Motion
            v-if="result.text.topMentions.length === 0"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.5, delay: 0.3 }"
          >
            <div class="text-muted-foreground text-base py-2 w-full">
              Oops... 你今年沒有 @ 過任何人
            </div>
          </Motion>
          <Motion
            v-for="(mention, index) in result.text.topMentions"
            v-else
            :key="mention.username"
            :initial="{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(8px)' }"
            :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }"
            :transition="{ 
              duration: 0.5, 
              delay: 0.3 + index * 0.15, 
              type: 'spring',
              stiffness: 120,
              damping: 15
            }"
          >
            <a
              :href="`https://threads.com/${mention.username}`"
              target="_blank"
              class="flex items-center gap-2 px-4 py-2 bg-muted rounded-full hover:bg-muted-foreground/10 transition-colors"
            >
              <span class="text-lg">{{ getMedal(index) }}</span>
              <span class="font-medium">@{{ mention.username }}</span>
              <span class="text-sm text-muted-foreground">({{ mention.count }}次)</span>
            </a>
          </Motion>
        </div>
      </div>

      <!-- Top Keywords -->
      <div
        v-if="result.text.topKeywords.length > 0"
        class="pt-8 space-y-4"
      >
        <Motion
          :initial="{ opacity: 0, y: -20, filter: 'blur(10px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :transition="{ 
            duration: 0.7, 
            delay: 0.8, 
            type: 'spring',
            stiffness: 100,
            damping: 15
          }"
        >
          <h3 class="text-2xl font-semibold">你最常用這些字</h3>
        </Motion>
        <Motion
          v-if="result.text.topKeywords.length === 0"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.5, delay: 1.0 }"
        >
          <div class="text-muted-foreground text-base py-2 w-full">
            Oops... 找不出你最常提到的關鍵字
          </div>
        </Motion>
        <div
          v-else
          class="flex flex-wrap justify-center gap-2"
        >
          <Motion
            v-for="(k, index) in result.text.topKeywords"
            :key="k.keyword"
            :initial="{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }"
            :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
            :transition="{ 
              duration: 0.4, 
              delay: 1.0 + index * 0.08, 
              type: 'spring',
              stiffness: 150,
              damping: 12
            }"
          >
            <span
              class="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10 transition-colors"
            >
              {{ k.keyword }}
            </span>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import type { RecapAnalysisResult } from '~/types/threads';

interface Props {
  result: RecapAnalysisResult;
}

defineProps<Props>();

function getMedal(index: number): string {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index] || '';
}
</script>