<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm">
    <div class="flex items-center gap-2">
      <button
        @click="$emit('toggle-sidebar')"
        class="rounded-full p-2 hover:bg-muted md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu class="h-6 w-6" />
      </button>
       <router-link 
        to="/vue-doctor-app/dashboard" 
        class="text-lg font-semibold text-primary hidden md:block whitespace-nowrap"
        :class="{ 'md:!hidden': sidebarOpen && !isMobile }"
        >
        AI慢病管理系统-医生端
      </router-link>
    </div>
    <div class="flex items-center gap-4">
      <button class="rounded-full p-2 hover:bg-muted" aria-label="Notifications">
        <Bell class="h-5 w-5" />
      </button>
      <button class="rounded-full p-1 hover:bg-muted" aria-label="User profile">
        <UserCircleIcon class="h-7 w-7 text-muted-foreground" />
      </button>
      <!-- Future: Dropdown for user profile -->
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Bell, UserCircle as UserCircleIcon } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  sidebarOpen: Boolean,
});
defineEmits(['toggle-sidebar']);

const isMobile = ref(window.innerWidth < 768);
const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  updateMobileStatus();
  window.addEventListener('resize', updateMobileStatus);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus);
});

</script>
