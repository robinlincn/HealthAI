<template>
  <div class="p-4">
    <h1 class="text-xl font-semibold mb-4">系统设置</h1>
    <div class="bg-card p-6 rounded-lg shadow-md text-center">
      <Settings class="w-16 h-16 text-primary/50 mx-auto mb-4" />
      <p class="text-muted-foreground">系统设置功能正在建设中。</p>
      <p class="text-sm mt-2">您将能够在此管理通知、主题、数据同步与安全等设置。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next';
</script>
