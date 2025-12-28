<template>
  <div class="px-4 pb-2">
    <!-- folder name hint -->
    <UploadFolderNameHint
      v-if="uploadedFolderName && !isValidFolderName"
      :uploaded-folder-name="uploadedFolderName"
      :is-valid-folder-name="isValidFolderName"
    />

    <!-- File Limit Error (too many files or too large) -->
    <Alert
      v-else-if="uploadError"
      variant="destructive"
      class="border-destructive/20"
    >
      <AlertCircle class="size-5" />
      <AlertTitle>
        {{ uploadError.type === 'too_many_files' ? '檔案數量超過上限' : '檔案大小超過上限' }}
      </AlertTitle>
      <AlertDescription>
        <p>{{ uploadError.message }}</p>

        <p class="mt-2 text-xs text-muted-foreground">
          <template v-if="uploadError.type === 'too_many_files'">
            請選擇 {{ DISPLAY_FOLDER_NAME }} 資料夾，而非整個匯出資料夾。
            上限：{{ MAX_FILE_COUNT }} 個檔案
          </template>
          <template v-else>
            請選擇 {{ DISPLAY_FOLDER_NAME }} 資料夾，而非整個匯出資料夾。
            上限：{{ Math.round(FILE_SIZE_LIMIT / (1024 * 1024)) }} MB
          </template>
        </p>
      </AlertDescription>
    </Alert>

    <!-- General Error Message -->
    <Alert
      v-else-if="error && !validationResult"
      variant="destructive"
      class="border-destructive/20"
    >
      <AlertCircle class="size-5" />
      <AlertTitle>上傳失敗</AlertTitle>
      <AlertDescription>
        <p>{{ error || '上傳失敗，請重新上傳' }}</p>
      </AlertDescription>
    </Alert>

    <!-- Validation Result -->
    <Alert v-else-if="validationResult && !validationResult.isValid && !uploadError">
      <AlertCircle class="size-5" />
      <AlertTitle>檔案驗證失敗</AlertTitle>
      <AlertDescription>
        <!-- Missing files list -->
        <template v-if="validationResult.missingFiles.length > 0">
          <p class="mt-2">
            缺少必要檔案：
          </p>
          <ul class="list-disc ml-5 my-1 text-xs text-muted-foreground">
            <li
              v-for="file in validationResult.missingFiles"
              :key="file"
            >
              {{ file }}
            </li>
          </ul>
        </template>
        <span class="block mt-2">請確認你採用 JSON 匯出格式，或是選擇解壓縮後的資料夾</span>
      </AlertDescription>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert';
import { FILE_SIZE_LIMIT, MAX_FILE_COUNT } from '~/constants';
import type { UploadError } from '~/utils/validate-file-limits';

interface ValidationResult {
  readonly isValid: boolean;
  readonly missingFiles: readonly string[];
  readonly foundFiles: readonly string[];
  readonly errors: readonly string[];
  readonly uploadedFolderName?: string;
  readonly isValidFolderName?: boolean;
}

const DISPLAY_FOLDER_NAME = 'your_instagram_activity -> threads' as const;

defineProps<{
  uploadError: UploadError | null;
  error: string | null;
  validationResult: ValidationResult | null;
  uploadedFolderName: string | null;
  isValidFolderName: boolean;
}>();
</script>
