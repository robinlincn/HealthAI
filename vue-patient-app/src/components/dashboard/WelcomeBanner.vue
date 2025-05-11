<template>
  <div class="mb-6 shadow-md overflow-hidden bg-card rounded-lg">
    <div class="p-4 flex items-center space-x-4">
      <div class="h-16 w-16 border-2 border-primary/30 rounded-full flex items-center justify-center bg-muted">
        <img v-if="mockUserData.avatarUrl" :src="mockUserData.avatarUrl" :alt="mockUserData.name" class="h-full w-full rounded-full object-cover" />
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

const mockUserData = {
  name: "示例用户 (Vue)",
  avatarUrl: "https://picsum.photos/seed/useravatarvue/100/100",
  managingDoctor: "王医生 (Vue)",
};
</script>
