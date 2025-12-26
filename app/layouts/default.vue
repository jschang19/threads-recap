<template>
  <div class="relative h-[dvh] min-h-full">
    <AppHeader />
    <div class="flex flex-col h-full pt-16 pb-24">
      <main class="flex-1">
        <slot />
      </main>
    </div>
    <AppFooter />
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import 'vue-sonner/style.css';
import { Toaster } from '@/components/ui/sonner';
import { computed } from 'vue';

const title = 'Threads 2025 年度總回顧 - Threadseeker';
const description
  = '用 Threadseeker Recap 來建立你的 threads.com 2025 年度回顧紀錄！幫你分析這一整年在脆的發文紀錄與數據，還有最常提及的朋友與打的關鍵字。';
const keywords = 'threads';
const ogImagePath = '/images/banner.webp';

const config = useRuntimeConfig();
const route = useRoute();
const canonicalUrl = computed(() => new URL(route.fullPath, `${config.public.siteHost}/`).toString());
const ogImageUrl = computed(() => new URL(ogImagePath, `${config.public.siteHost}/`).toString());

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImageUrl,
});

useHead({
  htmlAttrs: { lang: 'zh-Hant' },
  meta: [
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index,follow' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
});
</script>
