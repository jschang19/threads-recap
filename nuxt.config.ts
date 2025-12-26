import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appId: 'tks-recap',
  modules: ['shadcn-nuxt', 'motion-v/nuxt', '@nuxt/eslint'],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  spaLoadingTemplate: true,
  runtimeConfig: {
    public: {
      siteHost: process.env.SITE_HOST || 'https://recap.threadseeker.com',
    },
  },
  compatibilityDate: '2025-12-25',
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: true,
        indent: 2,
      },
    },
  },
});
