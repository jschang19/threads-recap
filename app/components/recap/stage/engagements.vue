<template>
  <div class="min-h-[75vh] flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center space-y-4 max-w-lg mx-auto w-full">
      <!-- Title -->
      <div class="space-y-2">
        <MotionBox
          preset="fadeDown"
          :delay="0.1"
        >
          <h2 class="text-2xl font-bold">你今年的互動軌跡</h2>
        </MotionBox>
        <MotionBox
          preset="fadeUp"
          :delay="0.25"
        >
          <p class="text-muted-foreground">來看看你今年在 Threads 上做了什麼</p>
        </MotionBox>
      </div>

      <!-- Likes & Saves Stats -->
      <div class="grid grid-cols-2 gap-4">
        <MotionBox
          preset="card"
          :delay="0.4"
        >
          <div class="flex items-center justify-center flex-col gap-1 p-6 bg-[#f5f5f5] rounded-xl">
            <div class="flex items-center gap-2">
              <Heart class="w-6 h-6" />
              <p class="text-2xl font-black">{{ result.social.likesIn2025 }}</p>
            </div>
            <p class="text-sm text-muted-foreground">你按過的讚數</p>
          </div>
        </MotionBox>
        <MotionBox
          preset="card"
          :delay="0.55"
        >
          <div class="flex items-center justify-center flex-col gap-1 p-6 bg-[#f5f5f5] rounded-xl">
            <div class="flex items-center gap-2">
              <Bookmark class="w-6 h-6" />
              <p class="text-2xl font-black">{{ result.social.savedIn2025 }}</p>
            </div>
            <p class="text-sm text-muted-foreground">你收藏的貼文數</p>
          </div>
        </MotionBox>
      </div>

      <!-- Social Stats -->
      <div class="grid grid-cols-2 gap-4">
        <MotionBox
          preset="card"
          :delay="0.7"
        >
          <div class="p-4 bg-[#f5f5f5] rounded-xl flex flex-col gap-1 justify-center items-center">
            <div class="flex items-center gap-2">
              <UserRoundPlus class="w-6 h-6" />
              <p class="text-2xl font-bold">{{ result.social.totalFollowers }}</p>
            </div>
            <p class="text-sm text-muted-foreground">粉絲數</p>
            <p class="text-xs text-muted-foreground/70">(+{{ result.social.newFollowersIn2025 }})</p>
          </div>
        </MotionBox>
        <MotionBox
          preset="card"
          :delay="0.85"
        >
          <div class="p-4 bg-[#f5f5f5] rounded-xl flex flex-col gap-1 justify-center items-center">
            <div class="flex items-center gap-2">
              <BellPlus class="w-6 h-6" />
              <p class="text-2xl font-bold">{{ result.social.totalFollowing }}</p>
            </div>
            <p class="text-sm text-muted-foreground">追蹤數</p>
            <p class="text-xs text-muted-foreground/70">(+{{ result.social.newFollowingIn2025 }})</p>
          </div>
        </MotionBox>
      </div>


      <!-- Fun Fact -->
      <MotionBox
        preset="fadeUp"
        :delay="1.5"
        :duration="0.5"
        :damping="20"
      >
        <div class="pt-6 rounded-xl">
          <p class="text-xl text-muted-foreground">
            你知道嗎？<br>你平均每天在 Threads 上按 <span class="font-semibold text-foreground">{{ avgDailyLikes }}</span> 個讚喔
          </p>
        </div>
      </MotionBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MotionBox } from '~/components/ui/motion-box';
import { Heart, Bookmark, UserRoundPlus, BellPlus } from 'lucide-vue-next';
import type { RecapAnalysisResult } from '~/types/threads';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

const avgDailyLikes = computed(() => {
  // Assuming data is for 2025
  const daysInYear = 365;
  return Math.round(props.result.social.likesIn2025 / daysInYear * 10) / 10 || 0;
});
</script>
