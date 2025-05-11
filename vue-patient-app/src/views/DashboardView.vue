<template>
  <div class="p-4 space-y-4">
    <div class="bg-card p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-primary">今日概览 (Vue)</h2>
      <p class="text-muted-foreground text-sm">您的健康数据摘要 (示例)。</p>
      <!-- Add overview data cards here -->
    </div>

    <div class="bg-card p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold">常用功能</h2>
      <ul class="mt-2 space-y-2">
        <li>
          <router-link to="/dashboard/health-data" class="text-primary hover:underline">健康数据</router-link>
        </li>
        <li>
          <router-link to="/dashboard/nutrition" class="text-primary hover:underline">饮食记录</router-link>
        </li>
        <!-- Add more links -->
      </ul>
    </div>
    <p class="text-center text-sm text-muted-foreground">Vue Patient Dashboard - Content is being developed.</p>
  </div>
</template>

<script setup lang="ts">
// Placeholder for Dashboard logic
</script>
