<template>
  <header class="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
    <button
      v-if="showBackButton"
      @click="router.back()"
      class="text-primary-foreground hover:bg-primary/80 mr-2 p-2 rounded-full -ml-2"
      aria-label="返回上一页"
    >
      <ChevronLeft class="h-6 w-6" />
    </button>
    <h1 
      class="text-lg font-semibold truncate"
      :class="showBackButton ? 'flex-grow text-left' : 'w-full text-center'"
    >
      {{ pageTitle }}
    </h1>
    <!-- Optional: Spacer for centering title when back button is present -->
    <!-- <div v-if="showBackButton" class="w-8 h-8"></div> -->
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import { useUiStore } from '@/stores/uiStore'; // Assuming you have a store for page title

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();

const pageTitle = computed(() => uiStore.pageTitle);

const showBackButton = computed(() => {
  // Show back button if not on the main dashboard view or any other root views
  // Adjust this logic based on your root paths
  const rootPaths = ['/vue-patient-app/dashboard', '/vue-patient-app/auth/login', '/vue-patient-app/auth/register'];
  return !rootPaths.includes(route.path);
});
</script>
