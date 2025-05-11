<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>健康数据</VCardTitle>
        <VCardDescription>查看和记录您的健康指标。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">健康数据记录和图表展示功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <LineChart class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">图表与数据输入</p>
          <p class="text-sm text-muted-foreground mt-1">
            此模块将允许您手动输入或同步血糖、血压等数据，并以图表形式展示。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { LineChart } from 'lucide-vue-next';
</script>
