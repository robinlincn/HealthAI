<template>
  <nav class="bg-card border-t border-border sticky bottom-0 z-20 flex-shrink-0">
    <div class="flex justify-around items-center h-16">
      <router-link
        v-for="link in bottomNavLinks"
        :key="link.title"
        :to="link.href"
        class="flex flex-col items-center justify-center flex-1 p-1 text-center"
        :class="{ 'text-primary': isActive(link.href), 'text-muted-foreground': !isActive(link.href) }"
      >
        <component :is="link.icon" class="h-5 w-5 mb-0.5" />
        <span class="text-xs" :class="{ 'font-medium': isActive(link.href) }">
          {{ link.title }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { NavItemVue } from '@/lib/types-vue';
import { LayoutDashboard, LineChart, MessageSquare, UserCircle } from 'lucide-vue-next'; // Using MessageSquare as placeholder for Bot

const bottomNavLinks: NavItemVue[] = [
  { title: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
  { title: '健康数据', href: '/dashboard/health-data', icon: LineChart },
  { title: 'AI助手', href: '/dashboard/assistant', icon: MessageSquare }, // Placeholder
  { title: '我的', href: '/dashboard/profile', icon: UserCircle },
];

const route = useRoute();

const isActive = (href: string) => {
  if (href === '/dashboard') {
    return route.path === '/dashboard';
  }
  return route.path.startsWith(href);
};
</script>
