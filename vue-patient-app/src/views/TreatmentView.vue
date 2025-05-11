<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>治疗方案</VCardTitle>
        <VCardDescription>查看医生为您制定的治疗方案。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">治疗方案查看功能正在开发中。</p>
         <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <ClipboardList class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">个性化方案</p>
          <p class="text-sm text-muted-foreground mt-1">
            医生制定的药物、生活方式调整等治疗计划将在此展示。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { ClipboardList } from 'lucide-vue-next';
</script>
