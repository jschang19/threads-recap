<template>
  <div class="min-h-[75vh] flex flex-col items-center justify-center px-4 pt-24 pb-8">
    <div class="text-center space-y-8 max-w-lg mx-auto w-full">
      <!-- Top Mentions -->
      <div
        v-if="result.text.topMentions.length > 0"
        class="space-y-4"
      >
        <MotionBox
          preset="fadeDown"
          :delay="0.1"
        >
          <h3 class="text-2xl font-semibold">你最常 @ 這些人</h3>
        </MotionBox>
        <div class="flex flex-wrap justify-center gap-3">
          <MotionBox
            v-if="result.text.topMentions.length === 0"
            preset="fade"
            :delay="0.3"
          >
            <div class="text-muted-foreground text-base py-2 w-full">
              Oops... 你今年沒有 @ 過任何人
            </div>
          </MotionBox>
          <MotionBox
            v-for="(mention, index) in result.text.topMentions"
            v-else
            :key="mention.username"
            preset="card"
            :delay="0.3 + index * 0.15"
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
          </MotionBox>
        </div>
      </div>

      <!-- Top Keywords -->
      <div
        v-if="result.text.topKeywords.length > 0"
        class="pt-8 space-y-4"
      >
        <MotionBox
          preset="fadeDown"
          :delay="0.8"
          :slide-y="-20"
        >
          <h3 class="text-2xl font-semibold">你最常用這些字</h3>
        </MotionBox>
        <MotionBox
          v-if="result.text.topKeywords.length === 0"
          preset="fade"
          :delay="1.0"
        >
          <div class="text-muted-foreground text-base py-2 w-full">
            Oops... 找不出你最常提到的關鍵字
          </div>
        </MotionBox>
        <div
          v-else
          class="flex flex-wrap justify-center gap-2"
        >
          <MotionBox
            v-for="(k, index) in result.text.topKeywords"
            :key="k.keyword"
            preset="fadeScale"
            :delay="1.0 + index * 0.08"
            :duration="0.4"
            :scale="0.8"
            :blur="6"
            :stiffness="150"
            :damping="12"
          >
            <span
              class="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10 transition-colors"
            >
              {{ k.keyword }}
            </span>
          </MotionBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MotionBox } from '~/components/ui/motion-box';
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
