<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md space-y-8">
      <!-- Status Text -->
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold tracking-tight">
          {{ progress.progress }}% {{ statusTitle }}
        </h2>
        <p class="text-muted-foreground">
          {{ progress.message || '準備中...' }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <Progress
          :model-value="progress.progress"
          class="h-2"
        />
      </div>

      <!-- Stage Indicators -->
      <div class="flex justify-center gap-4">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="flex flex-col items-center gap-2"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            :class="{
              'bg-foreground text-background': isStageComplete(stage.id) || isStageActive(stage.id),
              'bg-muted text-muted-foreground': !isStageComplete(stage.id) && !isStageActive(stage.id),
            }"
          >
            <Check
              v-if="isStageComplete(stage.id)"
              class="w-4 h-4"
            />
            <Loader2
              v-else-if="isStageActive(stage.id)"
              class="w-4 h-4 animate-spin"
            />
            <component
              :is="stage.icon"
              v-else
              class="w-4 h-4"
            />
          </div>
          <span class="text-xs text-muted-foreground hidden sm:block">{{ stage.label }}</span>
        </div>
      </div>

      <!-- Privacy Note -->
      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          所有資料都在你的裝置上處理，不會上傳至任何伺服器
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Loader2, Sparkles, FileText, Clock, Users } from 'lucide-vue-next';
import { Progress } from '~/components/ui/progress';
import type { AnalysisProgress } from '~/types/threads';

interface Props {
  progress: AnalysisProgress;
}

const props = defineProps<Props>();

const stages = [
  { id: 'parsing', label: '讀取資料', icon: FileText },
  { id: 'analyzing-text', label: '分析文字', icon: FileText },
  { id: 'analyzing-time', label: '時間分析', icon: Clock },
  { id: 'analyzing-social', label: '社群統計', icon: Users },
];

const stageOrder = ['parsing', 'analyzing-text', 'analyzing-time', 'analyzing-social', 'complete'];

const statusTitle = computed(() => {
  switch (props.progress.stage) {
    case 'parsing':
      return '正在讀取你的資料...';
    case 'analyzing-text':
      return '分析你的文字內容...';
    case 'analyzing-time':
      return '整理時間軌跡...';
    case 'analyzing-social':
      return '計算社群互動...';
    case 'complete':
      return '即將完成！';
    default:
      return '處理中...';
  }
});

function isStageComplete(stageId: string): boolean {
  const currentIndex = stageOrder.indexOf(props.progress.stage);
  const stageIndex = stageOrder.indexOf(stageId);
  return stageIndex < currentIndex;
}

function isStageActive(stageId: string): boolean {
  return props.progress.stage === stageId;
}
</script>

