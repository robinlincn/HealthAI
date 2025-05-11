<template>
  <div class="p-4">
    <h1 class="text-xl font-semibold mb-4">健康数据</h1>
    <div class="bg-card p-6 rounded-lg shadow-md text-center">
      <LineChart class="w-16 h-16 text-primary/50 mx-auto mb-4" />
      <p class="text-muted-foreground">健康数据记录与图表展示功能正在建设中。</p>
      <p class="text-sm mt-2">您将能够在此手动记录或同步您的血糖、血压、体重等数据，并查看历史趋势。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChart } from 'lucide-vue-next';
</script>
