<template>
  <div class="p-4 md:p-6 space-y-6">
    <div class="bg-card p-6 rounded-lg shadow">
      <h1 class="text-2xl font-semibold text-primary">医生端仪表盘 (Vue版)</h1>
      <p class="text-muted-foreground mt-2">
        欢迎来到 AI 慢病管理系统医生端。此区域功能正在建设中。
      </p>
    </div>

    <!-- Placeholder for stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-card p-4 rounded-lg shadow">
        <h2 class="text-lg font-medium text-foreground">统计指标 {{ i }}</h2>
        <p class="text-3xl font-bold text-primary mt-1">0</p>
        <p class="text-xs text-muted-foreground mt-1">占位描述</p>
      </div>
    </div>

    <!-- Placeholder for other modules -->
    <div class="bg-card p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-foreground">近期活动/病人预警 (占位)</h2>
      <p class="text-muted-foreground mt-2">
        此处将显示医生相关的近期活动、病人健康预警等重要信息。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUiStore } from '@/stores/uiStore'; // Assuming you have a uiStore for page titles

const uiStore = useUiStore();

onMounted(() => {
  uiStore.setPageTitle('医生仪表盘');
});
</script>
