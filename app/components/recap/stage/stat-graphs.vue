<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center space-y-6 max-w-2xl mx-auto w-full">
      <!-- Title -->
      <div class="space-y-2">
        <h2 class="text-3xl font-bold">
          你的專屬報表
        </h2>
        <p class="text-muted-foreground">
          看看你這一年的發文統計圖
        </p>
      </div>

      <!-- Monthly Bar Chart -->
      <div class="space-y-4 pt-4">
        <h3 class="text-lg font-semibold">
          過去 12 個月的發文數
        </h3>
        <p class="text-sm text-muted-foreground">
          點擊圖表查看詳細資料
        </p>
        <div class="w-full h-48 sm:h-56">
          <BarChart
            :labels="monthLabels"
            :data="monthlyData"
            label="發文數"
          />
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="space-y-4 pt-4">
        <h3 class="text-lg font-semibold">
          活動熱度
        </h3>
        <p class="text-sm text-muted-foreground">
          點擊區塊查看詳細資料
        </p>
        <div class="w-full h-40 sm:h-48">
          <Heatmap :data="result.time.heatmapData" />
        </div>
      </div>

      <!-- Peak Activity Info -->
      <div class="grid grid-cols-2 gap-4 pt-2">
        <div class="p-4 bg-muted rounded-xl">
          <p class="text-2xl font-bold">
            {{ peakMonthName }}
          </p>
          <p class="text-sm text-muted-foreground">
            最活躍月份
          </p>
        </div>
        <div class="p-4 bg-muted rounded-xl">
          <p class="text-2xl font-bold">
            {{ result.time.mostActiveDay }}
          </p>
          <p class="text-sm text-muted-foreground">
            最愛發文日
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecapAnalysisResult } from '~/types/threads';
import { BarChart, Heatmap } from '~/components/charts';
import { MONTH_LABELS, MONTH_NAMES } from '~/constants';

interface Props {
  result: RecapAnalysisResult;
}

const props = defineProps<Props>();

const monthLabels = MONTH_LABELS;

const monthlyData = computed(() => {
  return props.result.time.monthlyStats.map(stat => stat.postCount);
});

const peakMonthName = computed(() => {
  return MONTH_NAMES[props.result.time.mostActiveMonth - 1] || '';
});
</script>
