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
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
</script>