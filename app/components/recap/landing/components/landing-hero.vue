<template>
  <div class="flex flex-col justify-center items-center pt-24 pb-4">
    <!-- Title -->
    <div class="space-y-4">
      <Motion
        :initial="{ opacity: 0, y: 18 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
      >
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
          2025<br>Threads 年度回顧
        </h1>
      </Motion>
      <Motion
        :initial="{ opacity: 0, y: 18 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.08 }"
      >
        <p class="text-base sm:text-lg">
          這一年的活網黑歷史，等你來重溫
        </p>
      </Motion>
    </div>

    <!-- CTA Button -->
    <div class="pt-3 space-y-2 flex flex-col items-center justify-center">
      <Motion
        :initial="{ opacity: 0, y: 14 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeOut', delay: 0.14 }"
        class="w-full"
      >
        <Button
          size="lg"
          class="text-base px-8 py-6 rounded-md h-12 w-full max-w-sm mx-auto"
          @click="emit('open-upload')"
        >
          開始回顧
        </Button>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 14 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeOut', delay: 0.2 }"
        class="w-full"
      >
        <Button
          size="sm"
          variant="outline"
          as="a"
          class="px-4 py-2 rounded-md h-12 text-base w-full max-w-sm mx-auto shadow-none"
          :href="tutorialHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          看教學
        </Button>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.45, ease: 'easeOut', delay: 0.26 }"
      >
        <span class="text-xs text-muted-foreground">
          只在手機或電腦執行分析，紀錄不會上傳伺服器 |
          <a
            :href="repoHref"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline"
          >如何確認？</a>
        </span>
      </Motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import { Button } from '~/components/ui/button';
import { LINKS } from '~/constants';

withDefaults(
  defineProps<{
    tutorialHref?: string;
    repoHref?: string;
  }>(),
  {
    tutorialHref: LINKS.TUTORIAL,
    repoHref: LINKS.REPO,
  },
);

const emit = defineEmits<{
  (e: 'open-upload'): void;
}>();
</script>


