<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>医生咨询</VCardTitle>
        <VCardDescription>与您的医生进行在线沟通。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">在线咨询和历史记录功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <MessageSquare class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">医患沟通</p>
          <p class="text-sm text-muted-foreground mt-1">
            您可以在此发起新的咨询，或查看过往的咨询记录。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { MessageSquare } from 'lucide-vue-next';
</script>
