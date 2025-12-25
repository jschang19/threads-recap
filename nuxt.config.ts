import tailwindcss from '@tailwindcss/vite'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appId: 'tks-recap',
  compatibilityDate: '2025-12-25',
  spaLoadingTemplate: true,
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  ssr: false,
  modules: ['shadcn-nuxt', 'motion-v/nuxt'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    compressPublicAssets: true,
  }
})