<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component
      :is="Modal.Content"
      class="sm:max-w-lg"
      :class="[{ 'px-2 pb-8 *:px-4': !isDesktop }]"
    >
      <component :is="Modal.Header">
        <component :is="Modal.Title" class="text-xl">
          上傳你的匯出資料
        </component>
        <component :is="Modal.Description">
          選擇從 Meta 帳號中心匯出的資料夾。<br>
          <a href="https://reurl.cc/KOqXd9" target="_blank" rel="noopener noreferrer" class="hover:underline text-primary">
            <span class="text-sm font-semibold underline">
              還沒有匯出資料嗎？點我看教學
            </span>
            </a>
            <br>資料只會存儲在你的裝置上，不會被傳送到任何伺服器。
        </component>
      </component>
      
      <div class="py-4">
        <!-- Drop Zone (desktop only) -->
        <div
          v-if="isDesktop"
          class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
          :class="{
            'border-primary bg-primary/5': isDragging,
            'border-muted-foreground/25 hover:border-muted-foreground/50': !isDragging && !error,
            'border-destructive bg-destructive/5': error,
          }"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
              :class="{
                'bg-primary/10 text-primary': isDragging,
                'bg-muted text-muted-foreground': !isDragging && !error,
                'bg-destructive/10 text-destructive': error,
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
              'bg-muted text-muted-foreground': !error,
              'bg-destructive/10 text-destructive': error,
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

        <!-- Error Message -->
        <Alert variant="destructive" class="border-destructive/20" v-if="error && !validationResult">
          <AlertCircle class="size-5" />
          <AlertTitle>上傳失敗</AlertTitle>
          <AlertDescription>
            {{ error || '上傳失敗，請重新上傳' }}
          </AlertDescription>
        </Alert>

        <!-- Validation Result -->
        <Alert v-if="validationResult && !validationResult.isValid">
          <AlertCircle class="size-5" />
          <AlertTitle>檔案驗證失敗</AlertTitle>
          <AlertDescription>
            缺少必要檔案：
            <ul class="list-disc ml-5 my-1 text-xs text-muted-foreground">
              <li v-for="file in validationResult?.missingFiles" :key="file">
                {{ file }}
              </li>
            </ul>
            <span>請確認你採用 JSON 匯出格式，或是選擇解壓縮後的資料夾</span>
          </AlertDescription>
        </Alert>
      </div>

      <component :is="Modal.Footer" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2 gap-2 pt-2">
        <component :is="Modal.Close" as-child>
          <Button variant="ghost" class="h-12 text-base">
            取消
          </Button>
        </component>
        <Button
          class="h-12 text-base"
          :disabled="isLoading"
          @click="handleSelectFolder"
        >
          <Loader2
            v-if="isLoading"
            class="w-4 h-4 mr-2 animate-spin"
          />
          選擇資料夾
        </Button>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { FolderOpen, Loader2, AlertCircle } from 'lucide-vue-next';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';
import { Button } from '~/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert';

const emit = defineEmits<{
  success: [];
}>();

const isOpen = defineModel<boolean>('open', { default: false });

const isDesktop = useMediaQuery('(min-width: 640px)');

const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogClose : DrawerClose,
}));

const { selectFolder, handleDroppedFiles, validationResult, isLoading, error, reset } = useFileUpload();

const isDragging = ref(false);

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

async function onDrop(event: DragEvent) {
  isDragging.value = false;
  
  if (!event.dataTransfer?.items) return;
  
  const result = await handleDroppedFiles(event.dataTransfer.items);
  
  if (result.isValid) {
    emit('success');
    isOpen.value = false;
  }
}

async function handleSelectFolder() {
  const result = await selectFolder();
  
  if (result.isValid) {
    emit('success');
    isOpen.value = false;
  }
}

// reset error state when dialog is closed
watch(isOpen, (newVal) => {
  if (!newVal && (error.value || validationResult.value)) {
    reset();
  }
});
</script>

