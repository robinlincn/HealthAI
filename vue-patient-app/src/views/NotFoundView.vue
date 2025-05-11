<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <p class="text-2xl text-foreground mb-2">页面未找到</p>
    <p class="text-muted-foreground mb-6">抱歉，您访问的页面不存在。</p>
    <router-link to="/dashboard" class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      返回首页
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>
