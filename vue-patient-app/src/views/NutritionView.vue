<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>饮食记录</VCardTitle>
        <VCardDescription>记录您的每日饮食并查看营养分析。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">饮食记录、食物数据库和营养分析功能正在开发中。</p>
        <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <Apple class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">膳食追踪与分析</p>
          <p class="text-sm text-muted-foreground mt-1">
            此模块将包含食物搜索、三餐记录、营养计算和饮食建议。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { Apple } from 'lucide-vue-next';
</script>
