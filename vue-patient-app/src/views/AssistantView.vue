<template>
  <div class="flex flex-col h-full">
    <VCard class="flex-grow flex flex-col">
      <VCardHeader>
        <VCardTitle>AI小助手</VCardTitle>
        <VCardDescription>您的智能健康伙伴。</VCardDescription>
      </VCardHeader>
      <VCardContent class="flex-grow overflow-y-auto space-y-4">
        <!-- Chat messages will go here -->
        <div class="flex justify-start">
          <div class="bg-muted p-3 rounded-lg max-w-[80%]">
            <p class="text-sm">你好！我是AI健康助手，有什么可以帮您？</p>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
            <p class="text-sm">我最近血糖有点高怎么办？</p>
          </div>
        </div>
         <div class="flex justify-start">
          <div class="bg-muted p-3 rounded-lg max-w-[80%]">
            <p class="text-sm">请注意饮食，多监测。具体建议请咨询医生。 (AI模拟回复)</p>
          </div>
        </div>
      </VCardContent>
      <VCardFooter class="p-4 border-t">
        <div class="flex w-full space-x-2">
          <VInput placeholder="输入您的问题..." class="flex-grow" />
          <VButton><Send class="h-4 w-4" /></VButton>
        </div>
      </VCardFooter>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription, VCardFooter } from '@/components/ui/VCard';
import VInput from '@/components/ui/VInput.vue';
import VButton from '@/components/ui/VButton.vue';
import { Send } from 'lucide-vue-next';
</script>
