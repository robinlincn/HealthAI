<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>健康提醒</VCardTitle>
        <VCardDescription>管理您的服药和检查提醒。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">提醒设置和通知功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <BellRing class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">提醒管理</p>
          <p class="text-sm text-muted-foreground mt-1">
            设置服药、复查等提醒，系统将按时通知您。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { BellRing } from 'lucide-vue-next';
</script>
