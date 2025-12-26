<template>
  <div
    class="p-6 bg-white text-foreground rounded-xl space-y-4 border border-border w-[330px]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between pb-4">
      <div class="flex items-center gap-2">
        <img
          src="/images/logo.png"
          alt="logo"
          class="h-5"
        >
        <span class="font-semibold">Threadseeker</span>
      </div>
      <span class="text-sm text-muted-foreground font-mono pt-1">2025 Recap</span>
    </div>

    <!-- Main Stats -->
    <div class="grid grid-cols-2 gap-6 text-left">
      <div>
        <p class="text-xs text-muted-foreground">發文數</p>
        <p class="text-2xl font-medium">{{ postsCount }}</p>
      </div>
      <div>
        <p class="text-xs text-muted-foreground">字數</p>
        <p class="text-2xl font-medium">{{ formattedWordCount }}</p>
      </div>
      <div>
        <p class="text-xs text-muted-foreground">總按讚數</p>
        <p class="text-2xl font-medium">{{ likesCount }}</p>
      </div>
      <div>
        <p class="text-xs text-muted-foreground">新粉絲</p>
        <p class="text-2xl font-medium">+{{ newFollowersCount }}</p>
      </div>
    </div>

    <!-- Highlights -->
    <div class="pt-3 border-t space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">最活躍月份</span>
        <span class="font-medium">{{ peakMonthName }}</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">最愛發文日</span>
        <span class="font-medium">{{ mostActiveDay }}</span>
      </div>
    </div>

    <div class="pt-3 border-t space-y-1">
      <!-- Top Mention -->
      <div
        v-if="topMention"
        class="flex items-center justify-between text-xs"
      >
        <span class="text-muted-foreground">最常提及的人</span>
        <span class="font-medium">@{{ topMention }}</span>
      </div>

      <!-- Top Keywords -->
      <div
        v-if="topKeywords && topKeywords.length > 0"
        class="flex items-center justify-between text-xs"
      >
        <span class="text-muted-foreground">最常打的詞</span>
        <div class="flex items-center gap-1 flex-wrap">
          <span
            v-for="keyword in displayedKeywords"
            :key="keyword"
            class="px-3 py-0.5 bg-muted rounded-full font-medium"
          >
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  postsCount: number;
  totalWordCount: number;
  likesCount: number;
  newFollowersCount: number;
  peakMonthName: string;
  mostActiveDay: string;
  topMention?: string | null;
  topKeywords?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  topMention: null,
  topKeywords: () => [],
});

const formattedWordCount = computed(() => {
  return props.totalWordCount.toLocaleString('zh-TW');
});

const displayedKeywords = computed(() => {
  return props.topKeywords?.slice(0, 3) ?? [];
});
</script>

