import tailwindcss from '@tailwindcss/vite';
import { SEO_CONFIG } from './app/constants';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appId: 'tks-recap',
  modules: ['@nuxt/eslint', '@nuxt/scripts', 'motion-v/nuxt', 'shadcn-nuxt', '@nuxt/test-utils/module', '@sentry/nuxt/module'],
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      title: SEO_CONFIG.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: SEO_CONFIG.description },
        { name: 'keywords', content: SEO_CONFIG.keywords },
        { property: 'og:title', content: SEO_CONFIG.title },
        { property: 'og:description', content: SEO_CONFIG.description },
        { property: 'og:image', content: SEO_CONFIG.ogImagePath },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SEO_CONFIG.title },
        { name: 'twitter:description', content: SEO_CONFIG.description },
        { name: 'twitter:image', content: SEO_CONFIG.ogImagePath },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/tailwind.css'],
  spaLoadingTemplate: true,

  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
      },
      scripts: {
        clarity: {
          id: process.env.NUXT_PUBLIC_SCRIPTS_CLARITY_ID || 'urls3y4osz',
        },
      },
      siteHost: process.env.NUXT_PUBLIC_SITE_HOST || 'https://recap.threadseeker.app',
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
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },

  scripts: {
    registry: {
      clarity: true,
    },
  },

  sentry: {
    org: 'threadseeker',
    project: 'recap-tks-frontend',
  },

  sourcemap: {
    client: 'hidden',
  },
});