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
import { SEO_CONFIG } from '~/constants';

const config = useRuntimeConfig();
const route = useRoute();
const canonicalUrl = computed(() => new URL(route.fullPath, `${config.public.siteHost}/`).toString());
const ogImageUrl = computed(() => new URL(SEO_CONFIG.ogImagePath, `${config.public.siteHost}/`).toString());

useSeoMeta({
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  ogTitle: SEO_CONFIG.title,
  ogDescription: SEO_CONFIG.description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: SEO_CONFIG.title,
  twitterDescription: SEO_CONFIG.description,
  twitterImage: ogImageUrl,
});

useHead({
  htmlAttrs: { lang: 'zh-Hant' },
  meta: [
    { name: 'keywords', content: SEO_CONFIG.keywords },
    { name: 'robots', content: 'index,follow' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
});
</script>
