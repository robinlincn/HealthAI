<template>
  <div class="mb-6 rounded-lg border bg-card text-card-foreground shadow-md overflow-hidden">
    <div class="p-4 flex items-center space-x-4">
      <div class="h-16 w-16 border-2 border-primary/30 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img v-if="mockUserData.avatarUrl" :src="mockUserData.avatarUrl" :alt="mockUserData.name" :data-ai-hint="mockUserData.dataAiHint" class="h-full w-full object-cover" />
        <UserCircle v-else :size="36" class="text-muted-foreground" />
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-semibold text-foreground">
          欢迎回来, {{ mockUserData.name }}!
        </h2>
        <p class="text-sm text-muted-foreground flex items-center mt-1">
          <Stethoscope class="h-4 w-4 mr-1.5 text-primary" />
          您的主治医生: {{ mockUserData.managingDoctor }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserCircle, Stethoscope } from 'lucide-vue-next';

// Mock data - in a real app, this would come from user's profile and their assigned doctor
const mockUserData = {
  name: "示例用户",
  avatarUrl: "https://picsum.photos/seed/useravatarvue/100/100", // Different seed for Vue
  dataAiHint: "user avatar",
  managingDoctor: "王医生",
};
</script>
