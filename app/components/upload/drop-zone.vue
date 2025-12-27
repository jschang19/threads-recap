<template>
  <!-- Drop Zone (desktop only) -->
  <div
    v-if="isDesktop"
    class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
    :class="{
      'border-primary bg-primary/5': isDragging,
      'border-muted-foreground/25 hover:border-muted-foreground/50': !isDragging && !hasError,
      'border-destructive bg-destructive/5': hasError,
    }"
    @dragover.prevent="$emit('dragover')"
    @dragleave.prevent="$emit('dragleave')"
    @drop.prevent="(e: DragEvent) => $emit('drop', e)"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
        :class="{
          'bg-primary/10 text-primary': isDragging,
          'bg-muted text-muted-foreground': !isDragging && !hasError,
          'bg-destructive/10 text-destructive': hasError,
        }"
      >
        <FolderOpen
          v-if="!isLoading"
          class="w-8 h-8"
        />
        <Loader2
          v-else
          class="w-8 h-8 animate-spin"
        />
      </div>

      <div class="space-y-2">
        <p class="text-sm font-medium">
          {{ isDragging ? '放開以上傳資料夾' : '拖放資料夾至此處' }}
        </p>
        <p class="text-xs text-muted-foreground">
          或者點擊下方按鈕選擇資料夾
        </p>
      </div>
    </div>
  </div>

  <!-- Mobile upload icon -->
  <div
    v-else
    class="flex flex-col items-center gap-3 py-4"
  >
    <div
      class="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
      :class="{
        'bg-muted text-muted-foreground': !hasError,
        'bg-destructive/10 text-destructive': hasError,
      }"
    >
      <FolderOpen
        v-if="!isLoading"
        class="w-7 h-7"
      />
      <Loader2
        v-else
        class="w-7 h-7 animate-spin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen, Loader2 } from 'lucide-vue-next';

defineProps<{
  isDesktop: boolean;
  isDragging: boolean;
  isLoading: boolean;
  hasError: boolean;
}>();

defineEmits<{
  dragover: [];
  dragleave: [];
  drop: [event: DragEvent];
}>();
</script>
