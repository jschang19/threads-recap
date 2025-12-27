<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center space-y-8 max-w-lg mx-auto">
      <!-- Main Stats -->
      <div class="space-y-3">
        <MotionBox
          preset="fadeDown"
          :delay="0.1"
        >
          <p class="text-3xl font-bold">
            過去一年，你總共發了
          </p>
        </MotionBox>

        <MotionBox
          preset="fadeScale"
          :delay="0.3"
          :duration="0.8"
          :stiffness="80"
          :damping="18"
        >
          <div class="relative">
            <span class="text-8xl sm:text-9xl font-black tracking-tighter">
              <RowValue :value="roundedCount" />
            </span>
          </div>
        </MotionBox>

        <MotionBox
          preset="fadeUp"
          :delay="0.6"
          :slide-y="30"
        >
          <p class="text-xl text-muted-foreground">
            則貼文跟留言
          </p>
        </MotionBox>
      </div>

      <!-- Most Active Period -->
      <MotionBox
        preset="fadeUp"
        :delay="1.9"
        :duration="0.5"
        :blur="6"
        :damping="20"
      >
        <div class="pt-8">
          <p class="text-lg text-muted-foreground">
            {{ displayMessage }}
          </p>
        </div>
      </MotionBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { animate, useMotionValue, useTransform, RowValue } from 'motion-v';
import { MotionBox } from '~/components/ui/motion-box';
import type { RecapAnalysisResult } from '~/types/threads';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

// Animated counter for totalPosts
const count = useMotionValue(0);
const roundedCount = useTransform(() => Math.round(count.get()));

let controls: ReturnType<typeof animate> | undefined;

onMounted(() => {
  // Animate from 0 to totalPosts with a nice duration
  controls = animate(count, props.result.text.totalPosts, {
    duration: 2,
    ease: [0.25, 0.1, 0.25, 1], // cubic-bezier easing for smooth counting
  });
});

onUnmounted(() => {
  controls?.stop();
});

const displayMessage = computed(() => {
  // use different throttle of total posts to display different messages
  if (props.result.text.totalPosts < 30) {
    return '你都靜靜看別人發文耍寶是吧？';
  }
  else if (props.result.text.totalPosts < 999) {
    return '我看你發文還蠻多的，你很勇嘛！';
  }
  else {
    return '發這麼多，你的手指還好嗎？';
  }
});
</script>
