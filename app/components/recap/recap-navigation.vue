<template>
  <!-- Navigation -->
  <div class="py-6 px-4">
    <div class="max-w-md mx-auto">
      <!-- Page Indicators -->
      <div class="flex justify-center gap-2 mb-4">
        <button
          v-for="page in totalRecapPages"
          :key="page"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300"
          :class="{
            'bg-foreground w-6': page === currentRecapPage,
            'bg-muted-foreground/30 hover:bg-muted-foreground/50': page !== currentRecapPage,
          }"
          @click="emit('page-click', page)"
        />
      </div>

      <!-- Desktop Arrow Key Hint -->
      <Transition name="fade">
        <div
          v-if="!isMobile && showKeyHint"
          class="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4"
        >
          <kbd class="px-2 py-1 bg-muted rounded text-xs font-mono">←</kbd>
          <span>或</span>
          <kbd class="px-2 py-1 bg-muted rounded text-xs font-mono">→</kbd>
          <span>切換頁面</span>
        </div>
      </Transition>

      <!-- Mobile Swipe Hint -->
      <Transition name="fade">
        <div
          v-if="isMobile && showSwipeHint"
          class="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>左右滑動切換</span>
          <ChevronRight class="w-4 h-4" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps<{
  currentRecapPage: number;
  totalRecapPages: number;
  isMobile: boolean;
  showKeyHint: boolean;
  showSwipeHint: boolean;
}>();

const emit = defineEmits<{
  (e: 'page-click', page: number): void;
}>();
</script>

<style scoped>
/* Fade transition for hints */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


