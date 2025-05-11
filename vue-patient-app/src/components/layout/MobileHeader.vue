<template>
  <header class="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
    <button
      v-if="showBackButton"
      @click="goBack"
      class="text-primary-foreground hover:bg-primary/80 p-2 rounded-full mr-2"
      aria-label="返回上一页"
    >
      <ChevronLeft class="h-6 w-6" />
    </button>
    <h1 
      :class="[
        'text-lg font-semibold truncate',
        showBackButton ? 'flex-grow text-left' : 'w-full text-center'
      ]"
    >
      {{ title }}
    </h1>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import { navLinks } from '@/lib/nav-links-vue'; // Assuming this file will be created

const route = useRoute();
const router = useRouter();

const title = computed(() => {
  const matchedRoute = navLinks.find(link => {
    if (link.href === '/dashboard' && route.path === '/dashboard') return true;
    if (link.href !== '/dashboard' && (route.path === link.href || route.path.startsWith(link.href + '/'))) {
      const linkSegments = link.href.split('/');
      const pathSegments = route.path.split('/');
      if (pathSegments.length >= linkSegments.length && linkSegments[2] === pathSegments[2]) {
        if (route.path === link.href || (pathSegments.length > linkSegments.length && link.href.includes(pathSegments[2]))) {
          return true;
        }
      } else if (route.path === link.href) {
        return true;
      }
    }
    return false;
  });
  if (matchedRoute) return matchedRoute.title;
  if (route.path === '/dashboard') return '仪表盘';
  if (route.path.startsWith('/dashboard/profile/edit-details')) return '编辑资料';
  return 'AI慢病管理'; // Default
});

const showBackButton = computed(() => route.path !== '/dashboard');

const goBack = () => {
  router.back();
};
</script>
