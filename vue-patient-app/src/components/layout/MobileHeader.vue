<template>
  <header class="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
    <button
      v-if="showBackButton"
      @click="goBack"
      class="text-primary-foreground hover:bg-primary/80 mr-2 p-2 rounded-full"
      aria-label="返回上一页"
    >
      <ChevronLeft class="h-6 w-6" />
    </button>
    <h1
      :class="[
        'text-lg font-semibold truncate',
        showBackButton ? 'flex-grow text-left' : 'w-full text-center',
      ]"
    >
      {{ currentTitle }}
    </h1>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import { navLinks } from '@/lib/nav-links-vue';

const route = useRoute();
const router = useRouter();

const currentTitle = computed(() => {
  const matchedRoute = navLinks.find(link => {
     const currentPath = route.path;
     if (link.href === '/dashboard' && currentPath === '/dashboard') return true;
     if (link.href !== '/dashboard' && (currentPath === link.href || currentPath.startsWith(link.href + '/'))) {
        const linkSegments = link.href.split('/');
        const pathSegments = currentPath.split('/');
        if (pathSegments.length >= linkSegments.length && linkSegments[2] === pathSegments[2]) {
            if (currentPath === link.href || (pathSegments.length > linkSegments.length && link.href.includes(pathSegments[2]))) {
                 return true;
            }
        } else if (currentPath === link.href) {
            return true;
        }
     }
     return false;
  });

  if (matchedRoute) return matchedRoute.title;
  if (route.meta && route.meta.title) return route.meta.title as string;
  if (route.path === '/dashboard') return '仪表盘';
  if (route.path.startsWith('/dashboard/profile/edit-details')) return '编辑资料';
  return 'AI慢病管理系统';
});

const showBackButton = computed(() => route.path !== '/dashboard');

const goBack = () => {
  router.back();
};
</script>
