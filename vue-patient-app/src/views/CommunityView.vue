<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>社区互动</VCardTitle>
        <VCardDescription>与其他病友交流心得。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">病友社区功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <Users class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">病友家园</p>
          <p class="text-sm text-muted-foreground mt-1">
            一个温馨的交流平台，分享经验、互相鼓励。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { Users } from 'lucide-vue-next';
</script>
