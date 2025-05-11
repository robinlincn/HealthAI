<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <AlertTriangle class="w-24 h-24 text-destructive mb-6" />
    <h1 class="text-4xl font-bold text-destructive mb-2">404 - 页面未找到</h1>
    <p class="text-lg text-muted-foreground mb-8">
      抱歉，您访问的页面不存在或已被移动。
    </p>
    <router-link to="/dashboard" class="inline-flex items-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
      返回仪表盘
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
</script>
