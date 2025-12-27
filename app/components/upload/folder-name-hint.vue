<template>
  <div
    v-if="uploadedFolderName && !isValidFolderName"
    class="mt-2"
  >
    <p class="mb-2 text-sm">
      偵測到的資料夾：<code class="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">{{ uploadedFolderName }}</code>
    </p>
    <p class="text-xs text-muted-foreground mb-2">
      這不是正確的資料夾。請上傳以下其中一種名稱的資料夾：
    </p>
    <ul class="list-disc ml-5 my-1 text-xs text-muted-foreground">
      <li>
        <code class="px-1 py-0.5 bg-muted rounded font-mono">instagram-*</code>（以 instagram- 開頭）
      </li>
      <li>
        <code class="px-1 py-0.5 bg-muted rounded font-mono">your_instagram_activity</code>
      </li>
      <li>
        <code class="px-1 py-0.5 bg-muted rounded font-mono">threads</code>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  uploadedFolderName: string | null;
  isValidFolderName: boolean;
}>();
</script>
