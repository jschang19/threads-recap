<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
    <div class="text-center space-y-8 max-w-lg mx-auto relative z-10">
      <!-- Year Badge -->
      <MotionBox
        preset="badge"
        :delay="0.1"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium shadow-sm">
          <MotionBox
            preset="spinIn"
            :delay="0.5"
            class="inline-flex"
          >
            <Sparkle class="w-4 h-4" />
          </MotionBox>
          <span>2025 Threads Recap</span>
        </div>
      </MotionBox>

      <!-- Main Title -->
      <div class="space-y-4">
        <MotionBox
          preset="hero"
          :delay="0.3"
        >
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
            開始你的回顧
          </h1>
        </MotionBox>
        <MotionBox
          preset="fadeUp"
          :delay="0.6"
          :slide-y="30"
          :blur="8"
        >
          <p class="text-lg text-muted-foreground">
            探索你這一年在 Threads 的精彩時刻
          </p>
        </MotionBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next';
import { MotionBox } from '~/components/ui/motion-box';
</script>
