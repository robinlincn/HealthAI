<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>健康课程</VCardTitle>
        <VCardDescription>学习慢病管理知识。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">健康教育课程模块正在开发中。</p>
        <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <BookOpen class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">在线学习</p>
          <p class="text-sm text-muted-foreground mt-1">
            丰富的健康课程即将上线，助您更好地管理健康。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { BookOpen } from 'lucide-vue-next';
</script>
