
<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
    <AlertTriangleIcon class="w-20 h-20 text-destructive mb-4" />
    <h1 class="text-4xl font-bold text-foreground mb-2">404</h1>
    <p class="text-xl text-muted-foreground mb-6">抱歉，您访问的页面在Vue应用内不存在。</p>
    <router-link 
      to="/dashboard" 
      class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      <HomeIcon class="mr-2 h-4 w-4" />
      返回仪表盘
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangleIcon, HomeIcon } from 'lucide-vue-next';
</script>
