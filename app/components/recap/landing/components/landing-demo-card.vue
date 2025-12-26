<template>
  <div class="pt-12 w-full max-w-sm mx-auto">
    <MotionBox
      preset="slideUp"
      :delay="0.18"
      :duration="0.55"
    >
      <h2 class="text-2xl font-bold text-center mb-4">
        像 Spotify 一樣的年度回顧
      </h2>
    </MotionBox>

    <MotionBox
      preset="subtle"
      :delay="0.24"
      :duration="0.65"
      :scale="0.98"
    >
      <div class="flex justify-center items-center">
        <RecapCard
          :posts-count="MOCK_DEMO_DATA.postsCount"
          :total-word-count="MOCK_DEMO_DATA.totalWordCount"
          :likes-count="MOCK_DEMO_DATA.likesCount"
          :new-followers-count="MOCK_DEMO_DATA.newFollowersCount"
          :peak-month-name="MOCK_DEMO_DATA.peakMonthName"
          :most-active-day="MOCK_DEMO_DATA.mostActiveDay"
          :top-mention="MOCK_DEMO_DATA.topMention"
          :top-keywords="MOCK_DEMO_DATA.topKeywords"
        />
      </div>
    </MotionBox>
  </div>
</template>

<script setup lang="ts">
import RecapCard from '~/components/recap/recap-card.vue';
import { MotionBox } from '~/components/ui/motion-box';
import { MOCK_DEMO_DATA } from '~/constants';
</script>
