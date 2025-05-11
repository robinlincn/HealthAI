<template>
  <header class="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
    <button
      v-if="showBackButton"
      @click="goBack"
      class="text-primary-foreground hover:bg-primary/80 mr-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
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
      {{ pageTitle }}
    </h1>
    <!-- Optional: If you need to perfectly center title when back button is present, add a spacer -->
    <div v-if="showBackButton" class="w-10 h-6"></div> <!-- Adjust width to approximately match back button + margin -->
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import { navLinks } from '@/lib/nav-links-vue'; // Assuming this contains titles for main routes

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => {
  // Try to get title from route meta first
  if (route.meta && route.meta.title) {
    return route.meta.title as string;
  }

  // Fallback to navLinks if meta title is not available
  const activeLink = navLinks.find(link => {
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

  if (activeLink) return activeLink.title;
  if (route.path === '/dashboard') return '仪表盘';
  
  return 'AI慢病管理系统'; // Default title
});

const showBackButton = computed(() => route.path !== '/dashboard');

const goBack = () => {
  router.back();
};
</script>
