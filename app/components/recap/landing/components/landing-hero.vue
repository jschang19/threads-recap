<template>
  <div class="flex flex-col justify-center items-center pt-24 pb-4">
    <!-- Title -->
    <div class="space-y-4">
      <MotionBox preset="slideUp">
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
          2025<br>Threads 年度回顧
        </h1>
      </MotionBox>
      <MotionBox
        preset="slideUp"
        :delay="0.08"
      >
        <p class="text-base sm:text-lg">
          這一年的活網黑歷史，等你來重溫
        </p>
      </MotionBox>
    </div>

    <!-- CTA Button -->
    <div class="pt-3 space-y-2 flex flex-col items-center justify-center">
      <MotionBox
        preset="slideUp"
        :delay="0.14"
        :duration="0.5"
        :slide-y="14"
        class="w-full"
      >
        <Button
          size="lg"
          class="text-base px-8 py-6 rounded-md h-12 w-full max-w-sm mx-auto"
          @click="emit('open-upload')"
        >
          開始回顧
        </Button>
      </MotionBox>

      <MotionBox
        preset="slideUp"
        :delay="0.2"
        :duration="0.5"
        :slide-y="14"
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
      </MotionBox>

      <MotionBox
        preset="subtle"
        :delay="0.26"
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
      </MotionBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MotionBox } from '~/components/ui/motion-box';
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
