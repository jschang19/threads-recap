<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
    <div class="text-center space-y-8 max-w-lg mx-auto relative z-10">
      <!-- Year Badge -->
      <Motion
        :initial="{ opacity: 0, y: -30, scale: 0.8, filter: 'blur(10px)' }"
        :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }"
        :transition="{
          duration: 0.7,
          delay: 0.1,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium shadow-sm">
          <Motion
            :initial="{ rotate: -180, scale: 0 }"
            :animate="{ rotate: 0, scale: 1 }"
            :transition="{
              duration: 0.6,
              delay: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 12,
            }"
            class="inline-flex"
          >
            <Sparkle class="w-4 h-4" />
          </Motion>
          <span>2025 Threads Recap</span>
        </div>
      </Motion>

      <!-- Main Title -->
      <div class="space-y-4">
        <Motion
          :initial="{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(12px)' }"
          :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }"
          :transition="{
            duration: 0.8,
            delay: 0.3,
            type: 'spring',
            stiffness: 80,
            damping: 20,
          }"
        >
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
            開始你的回顧
          </h1>
        </Motion>
        <Motion
          :initial="{ opacity: 0, y: 30, filter: 'blur(8px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :transition="{
            duration: 0.6,
            delay: 0.6,
            type: 'spring',
            stiffness: 100,
            damping: 18,
          }"
        >
          <p class="text-lg text-muted-foreground">
            探索你這一年在 Threads 的精彩時刻
          </p>
        </Motion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next';
import { Motion } from 'motion-v';
</script>
