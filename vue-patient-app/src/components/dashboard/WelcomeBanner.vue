<template>
  <VCard class="mb-6 shadow-md overflow-hidden bg-card">
    <VCardContent class="p-4 flex items-center space-x-4">
      <VAvatar class="h-16 w-16 border-2 border-primary/30">
        <VAvatarImage :src="mockUserData.avatarUrl" :alt="mockUserData.name" :data-ai-hint="mockUserData.dataAiHint" />
        <VAvatarFallback class="text-xl">
          <UserCircle :size="36" />
        </VAvatarFallback>
      </VAvatar>
      <div class="flex-1">
        <VCardTitle class="text-xl font-semibold text-foreground">
          欢迎回来, {{ mockUserData.name }}!
        </VCardTitle>
        <VCardDescription class="text-sm text-muted-foreground flex items-center mt-1">
          <Stethoscope class="h-4 w-4 mr-1.5 text-primary" />
          您的主治医生: {{ mockUserData.managingDoctor }}
        </VCardDescription>
      </div>
    </VCardContent>
  </VCard>
</template>

<script setup lang="ts">
import { VCard, VCardContent, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { VAvatar, VAvatarImage, VAvatarFallback } from '@/components/ui/VAvatar';
import { UserCircle, Stethoscope } from 'lucide-vue-next';

const mockUserData = {
  name: "示例用户 (Vue)",
  avatarUrl: "https://picsum.photos/seed/useravatarvue/100/100",
  dataAiHint: "user avatar",
  managingDoctor: "王医生 (Vue)",
};
</script>
