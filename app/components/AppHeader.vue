<template>
  <header class="w-full h-14 bg-background/90 fixed top-0 z-50 backdrop-blur-sm shrink-0">
    <div class="grid grid-cols-[1fr_auto_1fr] h-full items-center px-4 md:px-8 mx-auto">
      <div class="grid grid-cols-subgrid col-span-2">
        <div class="col-start-2 mx-auto">
          <NuxtLink
            to="/"
            @click="handleLogoClick"
          >
            <div class="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="logo"
                class="h-6"
              >
              <span class="text-xl font-bold">Threadseeker</span>
              <span class="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">Recap</span>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <Popover v-model:open="popoverOpen">
          <PopoverTrigger as-child>
            <button class="p-2 hover:bg-muted rounded-lg transition-colors">
              <Menu class="size-5" />
            </button>
          </PopoverTrigger>
          <ClientOnly>
            <PopoverContent
              class="w-56 mr-3 p-2 rounded-xl"
              tabindex="0"
            >
              <div class="flex flex-col gap-1">
                <button
                  v-if="appStage !== 'landing'"
                  class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left"
                  @click="handleRestart"
                >
                  <RotateCcw class="w-4 h-4" />
                  重新開始
                </button>
                <a
                  href="https://threadseeker.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  <ExternalLink class="w-4 h-4" />
                  關於 Threadseeker
                </a>
              </div>
            </PopoverContent>
          </ClientOnly>
        </Popover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, RotateCcw, ExternalLink } from 'lucide-vue-next';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

const { appStage, reset, setStage } = useRecapStore();
const popoverOpen = ref(false);

function handleRestart() {
  reset();
  setStage('landing');
  popoverOpen.value = false;
}

function handleLogoClick() {
  if (appStage.value !== 'landing') {
    reset();
    setStage('landing');
  }
}
</script>
