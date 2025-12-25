<template>
  <div
    ref="containerRef"
    class="min-h-[80vh] flex flex-col"
  >
    <!-- Page Content -->
    <div class="flex-1 relative overflow-hidden">
      <Transition
        :name="transitionName"
        mode="out-in"
      >
        <component
          :is="currentPageComponent"
          :key="currentRecapPage"
          :result="analysisResult!"
        />
      </Transition>
    </div>

    <!-- Navigation -->
    <div class="py-6 px-4">
      <div class="max-w-md mx-auto">
        <!-- Page Indicators -->
        <div class="flex justify-center gap-2 mb-4">
          <button
            v-for="page in totalRecapPages"
            :key="page"
            @click="handlePageClick(page)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="{
              'bg-foreground w-6': page === currentRecapPage,
              'bg-muted-foreground/30 hover:bg-muted-foreground/50': page !== currentRecapPage,
            }"
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

        <!-- Restart Button (on last page) -->
        <div
          v-if="currentRecapPage === totalRecapPages"
          class="pt-3 space-y-2"
        >
          <Button
            variant="default"
            class="w-full h-12"
            @click="handleToFirstPage"
          >
            重新開始
          </Button>
          <Button
            variant="ghost"
            class="w-full h-12"
            @click="handleRestart"
          >
            建立新的回顧
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSwipe, onKeyStroke, useMediaQuery } from '@vueuse/core';
import { ChevronLeft, ChevronRight, RotateCcw, RefreshCw } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import RecapPageWelcome from './RecapPageWelcome.vue';
import RecapPage1 from './RecapPage1.vue';
import RecapPage2 from './RecapPage2.vue';
import RecapPage2A from './RecapPage2A.vue';
import RecapPage3 from './RecapPage3.vue';
import RecapPage4 from './RecapPage4.vue';
import RecapPage5 from './RecapPage5.vue';

const {
  currentRecapPage,
  totalRecapPages,
  analysisResult,
  canGoNext,
  canGoPrev,
  nextPage,
  prevPage,
  goToPage,
  reset,
  setStage,
} = useRecapStore();

const pages = [RecapPageWelcome, RecapPage1, RecapPage2, RecapPage2A, RecapPage3, RecapPage4, RecapPage5];
const currentPageComponent = computed(() => pages[currentRecapPage.value - 1]);

const containerRef = ref<HTMLElement | null>(null);
const transitionName = ref('slide-left');

// Mobile detection using VueUse
const isMobile = useMediaQuery('(max-width: 768px)');

// Hints
const showKeyHint = ref(true);
const showSwipeHint = ref(true);

// Swipe handling with VueUse
const { direction, lengthX, lengthY } = useSwipe(containerRef, {
  threshold: 50,
  onSwipeEnd() {
    // Only trigger if horizontal movement is greater than vertical
    // This prevents accidental swipes when scrolling
    if (Math.abs(lengthX.value) < Math.abs(lengthY.value) * 1.5) {
      return;
    }

    if (direction.value === 'left' && canGoNext.value) {
      showSwipeHint.value = false;
      handleNext();
    } else if (direction.value === 'right' && canGoPrev.value) {
      showSwipeHint.value = false;
      handlePrev();
    }
  },
});

// Keyboard navigation with VueUse
onKeyStroke('ArrowRight', () => {
  if (canGoNext.value) {
    showKeyHint.value = false;
    handleNext();
  }
});

onKeyStroke('ArrowLeft', () => {
  if (canGoPrev.value) {
    showKeyHint.value = false;
    handlePrev();
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function handleNext() {
  scrollToTop();
  transitionName.value = 'slide-left';
  nextPage();
}

function handlePrev() {
  scrollToTop();
  transitionName.value = 'slide-right';
  prevPage();
}

function handleToFirstPage() {
  scrollToTop();
  goToPage(1);
}

function handleRestart() {
  reset();
  setStage('landing');
}

function handlePageClick(page: number) {
  scrollToTop();
  goToPage(page);
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

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

