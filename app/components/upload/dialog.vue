<template>
  <component
    :is="Modal.Root"
    v-model:open="isOpen"
    @update:open="onUpdateOpen"
  >
    <component
      :is="Modal.Content"
      class="sm:max-w-lg"
      :class="[{ 'px-2 pb-8 *:px-4': !isDesktop }]"
    >
      <component
        :is="Modal.Header"
      >
        <component
          :is="Modal.Title"
          class="text-xl"
        >
          上傳你的匯出資料
        </component>
        <component
          :is="Modal.Description"
          class="leading-relaxed space-y-2"
        >
          <p class="text-sm">
            請先確保已解壓縮從 Meta 帳號中心匯出的檔案，搜尋 "threads" 資料夾並上傳
          </p>
          <a
            :href="LINKS.TUTORIAL"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline text-primary"
          >
            <span class="text-sm font-semibold underline">
              資料哪裡載？上傳失敗？點我看教學
            </span>
          </a>
        </component>
      </component>

      <LazyUploadDropZone
        v-if="isDesktop"
        class="my-4"
        :is-dragging="isDragging"
        :is-loading="isLoading"
        :has-error="!!error"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      />

      <LazyUploadErrorAlert
        v-if="hasError"
        :upload-error="uploadError"
        :error="error"
        :validation-result="validationResult"
        :uploaded-folder-name="uploadedFolderName"
        :is-valid-folder-name="isValidFolderName"
      />

      <component
        :is="Modal.Footer"
        class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2 gap-2 pt-2"
      >
        <component
          :is="Modal.Close"
          as-child
        >
          <Button
            variant="ghost"
            class="h-12 text-base"
          >
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
import { Loader2 } from 'lucide-vue-next';
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
import { LINKS } from '~/constants';

const emit = defineEmits<{
  success: [];
  close: [];
}>();

const isOpen = defineModel<boolean>('open', { default: false });
const isDesktop = useMediaQuery('(min-width: 640px)');
const hasError = computed(() => !!error || !!uploadError || !!validationResult);

const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogClose : DrawerClose,
}));

const { selectFolder, handleDroppedFiles, validationResult, isLoading, error, uploadError, uploadedFolderName, isValidFolderName } = useFileUpload();

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

function onUpdateOpen(open: boolean) {
  if (!open) {
    emit('close');
  }
}
</script>
