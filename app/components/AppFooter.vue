<template>
  <footer class="w-full py-6 text-muted-foreground shrink-0 border-t mt-auto">
    <div class="container max-w-3xl px-5 mx-auto flex flex-col items-center gap-3 text-sm">
      <div class="flex items-center gap-1">
        <ShieldCheck class="w-4 h-4" />
        <span>所有資料皆在本地處理，不會上傳至伺服器</span>
      </div>
      <div class="text-center text-xs">
        Made with ❤️ by
        <a
          href="https://threads.net/@cjs.shawn"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >@cjs.shawn</a>
        ·
        <a
          href="https://threadseeker.app"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >Threadseeker</a>
      </div>
      <div class="text-center text-xs">
        Not affiliated with Meta or Threads. Only display exported data withh offline processing.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next';
</script>
