<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-8">
      如何開始？
    </h2>

    <div class="grid md:grid-cols-4 gap-6">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="text-center space-y-3"
      >
        <div class="w-12 h-12 mx-auto rounded-full bg-foreground text-background flex items-center justify-center text-lg font-bold">
          {{ index + 1 }}
        </div>
        <h3 class="font-semibold">
          {{ step.title }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ step.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: Array<{
    title: string;
    description: string;
  }>;
}>();
</script>



