<template>
  <div
    class="p-6 bg-white text-foreground rounded-lg space-y-4 border border-border"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img
          src="/images/logo.png"
          alt="logo"
          class="h-5"
        >
        <span class="font-semibold">Threadseeker</span>
      </div>
      <span class="text-sm text-muted-foreground">2025 Recap</span>
    </div>

    <!-- Main Stats -->
    <div class="grid grid-cols-2 gap-4 text-left">
      <div>
        <p class="text-2xl font-black">{{ postsCount }}</p>
        <p class="text-sm text-muted-foreground">發文數</p>
      </div>
      <div>
        <p class="text-2xl font-black">{{ formattedWordCount }}</p>
        <p class="text-sm text-muted-foreground">字數</p>
      </div>
      <div>
        <p class="text-2xl font-black">{{ likesCount }}</p>
        <p class="text-sm text-muted-foreground">總按讚數</p>
      </div>
      <div>
        <p class="text-2xl font-black">+{{ newFollowersCount }}</p>
        <p class="text-sm text-muted-foreground">新粉絲</p>
      </div>
    </div>

    <!-- Highlights -->
    <div class="pt-3 border-t border-border">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">最活躍月份</span>
        <span class="font-semibold">{{ peakMonthName }}</span>
      </div>
      <div class="flex items-center justify-between text-sm mt-1">
        <span class="text-muted-foreground">最愛發文日</span>
        <span class="font-semibold">{{ mostActiveDay }}</span>
      </div>
    </div>

    <!-- Top Mention -->
    <div
      v-if="topMention"
      class="pt-2 border-t border-border"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">最常提及的人</span>
        <span class="font-semibold">@{{ topMention }}</span>
      </div>
    </div>

    <!-- Top Keywords -->
    <div
      v-if="topKeywords && topKeywords.length > 0"
      class="pt-2 border-t border-border"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">最常打的詞</span>
        <div class="flex items-center gap-1 flex-wrap">
          <span
            v-for="keyword in displayedKeywords"
            :key="keyword"
            class="px-3 py-1 bg-muted rounded-full text-sm"
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

