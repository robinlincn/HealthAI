import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export const useUiStore = defineStore('ui', () => {
  const route = useRoute();
  const manualTitle = ref<string | null>(null);

  const pageTitle = computed(() => {
    if (manualTitle.value) return manualTitle.value;
    return (route.meta?.title as string) || 'AI慢病管理';
  });

  function setPageTitle(title: string) {
    manualTitle.value = title;
  }

  function clearPageTitle() {
    manualTitle.value = null;
  }

  return { pageTitle, setPageTitle, clearPageTitle };
});
