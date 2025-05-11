<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>帮助与支持</VCardTitle>
        <VCardDescription>获取使用帮助和联系客服。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">帮助中心和客服联系功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <HelpCircle class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">用户支持</p>
          <p class="text-sm text-muted-foreground mt-1">
            常见问题解答、使用指南和联系客服渠道将在此提供。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { HelpCircle } from 'lucide-vue-next';
</script>
