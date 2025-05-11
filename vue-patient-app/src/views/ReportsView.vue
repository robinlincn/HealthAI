<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>检查报告</VCardTitle>
        <VCardDescription>上传和查看您的检查报告。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">检查报告上传和查看功能正在开发中。</p>
        <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <FileText class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">报告管理</p>
          <p class="text-sm text-muted-foreground mt-1">
            您将能在此上传PDF或图片格式的检查报告，并随时查看。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { FileText } from 'lucide-vue-next';
</script>
