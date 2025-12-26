import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appId: 'tks-recap',
  compatibilityDate: '2025-12-25',
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/scripts', 'motion-v/nuxt', 'shadcn-nuxt'],
  nitro: {
    compressPublicAssets: true,
  },
  runtimeConfig: {
    public: {
      scripts:{
        clarity: {
          id: process.env.NUXT_PUBLIC_SCRIPTS_CLARITY_ID || '',
        },
      },
      siteHost: process.env.SITE_HOST || 'https://recap.threadseeker.com',
    },
  },
  scripts:{
    registry: {
      clarity: true
    }
  },
  spaLoadingTemplate: true,
  ssr: false,
  vite: {
    plugins: [tailwindcss()],
  },
});
