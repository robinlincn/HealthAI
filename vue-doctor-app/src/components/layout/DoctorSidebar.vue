<template>
  <aside class="hidden md:flex md:flex-col md:w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border">
    <div class="flex items-center h-16 border-b border-sidebar-border px-6">
      <router-link to="/vue-doctor-app/dashboard" class="flex items-center space-x-2">
        <!-- Replace with your actual logo component or SVG -->
        <svg class="h-8 w-8 text-sidebar-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span class="font-bold text-lg">医生端</span>
      </router-link>
    </div>
    <nav class="flex-1 p-2 space-y-1 overflow-y-auto">
      <template v-for="link in navLinks" :key="link.href">
        <router-link
          :to="link.href"
          custom
          v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <a
            :href="href"
            @click="navigate"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
            :class="[
              isActive || (isExactActive && route.path === link.href)
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            ]"
          >
            <component :is="link.icon" class="mr-3 h-5 w-5" />
            <span>{{ link.title }}</span>
          </a>
        </router-link>
      </template>
    </nav>
    <div class="p-2 border-t border-sidebar-border">
      <button class="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        <LogOut class="mr-3 h-5 w-5" />
        <span>退出登录</span>
      </button>
    </div>
  </aside>
  <!-- Mobile sidebar placeholder -->
  <!-- Implement Sheet component for mobile if needed -->
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';
import { doctorNavLinksVue as navLinks } from '@/lib/nav-links-vue-doctor';
// Add mobile sidebar state management (e.g., with Pinia) if required
</script>

<style scoped>
/* Sidebar specific styles if Tailwind classes are not enough */
.bg-sidebar-background {
  background-color: var(--sidebar-background);
}
.text-sidebar-foreground {
  color: var(--sidebar-foreground);
}
.border-sidebar-border {
  border-color: var(--sidebar-border);
}
.hover\:bg-sidebar-accent:hover {
  background-color: var(--sidebar-accent);
}
.hover\:text-sidebar-accent-foreground:hover {
  color: var(--sidebar-accent-foreground);
}
.bg-sidebar-primary {
  background-color: var(--sidebar-primary);
}
.text-sidebar-primary-foreground {
  color: var(--sidebar-primary-foreground);
}
</style>
