<template>
  <div class="mt-8 p-4 rounded-xl bg-muted text-center">
    <p class="text-sm text-muted-foreground mb-2">
      還沒有匯出資料？有教學！
    </p>
    <a
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-sm font-medium hover:underline"
    >
      {{ label }}
      <ExternalLink class="w-4 h-4" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import { LINKS } from '~/constants';

withDefaults(
  defineProps<{
    href?: string;
    label?: string;
  }>(),
  {
    href: LINKS.TUTORIAL,
    label: '作者寫的手把手教學',
  },
);
</script>



