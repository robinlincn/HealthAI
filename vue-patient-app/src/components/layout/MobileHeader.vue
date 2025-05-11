<template>
  <header class="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
    <button
      v-if="showBackButton"
      @click="goBack"
      class="text-primary-foreground hover:bg-primary/80 mr-2 p-2 rounded-full focus:outline-none"
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
    <!-- Optional: Spacer to keep title centered when back button is present -->
    <div v-if="showBackButton" class="w-10"></div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import { useUiStore } from '@/stores/uiStore';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();

const pageTitle = computed(() => {
  // Attempt to get title from meta, fallback to a default or uiStore
  if (route.meta && route.meta.title) {
    return route.meta.title as string;
  }
  return uiStore.pageTitle;
});

const showBackButton = computed(() => {
  // Show back button if not on the main dashboard page or login/register root paths
  const nonBackPaths = ['/vue-patient-app/dashboard', '/vue-patient-app/auth/login', '/vue-patient-app/auth/register', '/vue-patient-app/'];
  return !nonBackPaths.includes(route.path);
});

const goBack = () => {
  router.back();
};
</script>
