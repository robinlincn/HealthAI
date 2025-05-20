<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
    <AlertTriangle class="w-16 h-16 text-destructive mb-4" />
    <h1 class="text-4xl font-bold text-destructive mb-2">404 - 页面未找到</h1>
    <p class="text-muted-foreground mb-6">抱歉，您访问的页面不存在或已被移动。</p>
    <RouterLink :to="VUE_APP_BASE_URL + 'dashboard'" class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium">
      返回仪表盘
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { AlertTriangle } from 'lucide-vue-next';
const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';
</script>
