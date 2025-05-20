<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 shadow-sm">
    <div class="flex items-center gap-4">
      <!-- Mobile menu button -->
      <button @click="toggleMobileSidebar" class="md:hidden rounded-full p-2 hover:bg-muted">
        <Menu class="h-6 w-6" />
        <span class="sr-only">Toggle Sidebar</span>
      </button>
      <div class="hidden md:block text-lg font-semibold text-primary">
        AI慢病管理系统 - 医生端
      </div>
    </div>
     <!-- Centered title on mobile -->
    <div class="md:hidden flex-1 flex justify-center">
        <span class="text-lg font-semibold text-primary">{{ uiStore.pageTitle }}</span>
    </div>
    <div class="flex items-center gap-4">
      <button class="rounded-full p-2 hover:bg-muted" aria-label="Notifications">
        <Bell class="h-5 w-5" />
      </button>
      <button class="rounded-full p-1 hover:bg-muted" aria-label="User profile">
        <UserCircle class="h-7 w-7 text-muted-foreground" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Bell, UserCircle } from 'lucide-vue-next';
import { useUiStore } from '@/stores/uiStore';

const uiStore = useUiStore();

const toggleMobileSidebar = () => {
  // Implement mobile sidebar toggle logic, possibly with Pinia store
  console.log("Toggle mobile sidebar");
};
</script>
