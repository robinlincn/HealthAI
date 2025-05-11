<template>
  <div class="space-y-6">
    <VCard>
      <VCardHeader>
        <VCardTitle>编辑个人资料</VCardTitle>
        <VCardDescription>管理您的详细个人信息、病史和紧急联系人。</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <p class="text-muted-foreground">详细资料编辑功能正在开发中。将包括基本信息、病史、紧急联系人等模块。</p>
        <div class="mt-4 p-6 border border-dashed rounded-md text-center">
          <UserCog class="h-12 w-12 mx-auto text-primary/30 mb-2" />
          <p class="text-lg font-semibold text-muted-foreground">健康档案维护</p>
          <p class="text-sm text-muted-foreground mt-1">
            您将能在此处编辑姓名、性别、联系方式、病史、过敏史等。
          </p>
        </div>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { UserCog } from 'lucide-vue-next'; // Using UserCog as a general edit icon
</script>
