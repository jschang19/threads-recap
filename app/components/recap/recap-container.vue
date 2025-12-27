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

    <RecapNavigation
      :current-recap-page="currentRecapPage"
      :total-recap-pages="totalRecapPages"
      :is-mobile="isMobile"
      :show-key-hint="showKeyHint"
      :show-swipe-hint="showSwipeHint"
      @page-click="handlePageClick"
    />
  </div>
</template>

<script setup lang="ts">
import { useSwipe, onKeyStroke, useMediaQuery } from '@vueuse/core';
import RecapNavigation from './recap-navigation.vue';
import { 
  RecapWelcomePage,
  RecapTotalPosts,
  RecapTotalWords,
  RecapMentionKeywords,
  RecapStatGraphs,
  RecapEngagements,
  RecapFinalResult,
} from './stage';
import { scrollToTop } from '~/utils/scroll-to-top';

const {
  currentRecapPage,
  totalRecapPages,
  analysisResult,
  canGoNext,
  canGoPrev,
  nextPage,
  prevPage,
  goToPage,
} = useRecapStore();

const pages = [RecapWelcomePage, RecapTotalPosts, RecapTotalWords, RecapMentionKeywords, RecapStatGraphs, RecapEngagements, RecapFinalResult];
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
    }
    else if (direction.value === 'right' && canGoPrev.value) {
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
</style>
