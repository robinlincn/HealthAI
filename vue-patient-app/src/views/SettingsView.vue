<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>系统设置</VCardTitle>
        <VCardDescription>调整应用偏好和账户安全设置。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">系统设置功能正在开发中。将包括主题选择、通知开关、数据同步等。</p>
        <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <Settings class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">个性化配置</p>
          <p class="text-sm text-muted-foreground mt-1">
            自定义您的应用体验，管理通知和数据安全选项。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { Settings } from 'lucide-vue-next';
</script>
