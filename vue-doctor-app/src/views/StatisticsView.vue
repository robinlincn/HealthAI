<template>
  <div class="p-6 bg-background min-h-full">
    <h1 class="text-3xl font-bold text-primary mb-6">统计报告</h1>
    <div class="bg-card p-6 rounded-lg shadow-md">
      <p class="text-muted-foreground">统计报告模块正在积极开发中。此页面将作为数据中心各统计子模块的入口。</p>
      <p class="mt-4">您将可以访问：</p>
      <ul class="list-disc list-inside text-muted-foreground mt-2 space-y-1">
        <li>病情趋势分析</li>
        <li>治疗效果评估</li>
        <li>自定义统计报表</li>
      </ul>
       <router-link to="/vue-doctor-app/dashboard/statistics/trends" class="text-accent hover:underline mt-4 inline-block mr-4">前往趋势分析 &rarr;</router-link>
       <router-link to="/vue-doctor-app/dashboard/statistics/evaluation" class="text-accent hover:underline mt-4 inline-block mr-4">前往效果评估 &rarr;</router-link>
       <router-link to="/vue-doctor-app/dashboard/statistics/custom-reports" class="text-accent hover:underline mt-4 inline-block">前往自定义报表 &rarr;</router-link>
    </div>
     <!-- This view can also use <router-view /> if it's a layout for statistics sub-pages -->
  </div>
</template>

<script setup lang="ts">
// Placeholder script
</script>
