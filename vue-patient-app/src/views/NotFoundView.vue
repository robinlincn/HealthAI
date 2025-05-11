<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
    <Frown class="w-24 h-24 text-primary/30 mb-6" />
    <h1 class="text-4xl font-bold text-primary mb-2">404</h1>
    <p class="text-xl text-foreground/80 mb-6">哎呀！您要找的页面不见了。</p>
    <VButton @click="goHome" size="lg">
      <Home class="mr-2 h-5 w-5" /> 返回首页
    </VButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import VButton from '@/components/ui/VButton.vue';
import { Frown, Home } from 'lucide-vue-next';

const router = useRouter();
const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const goHome = () => {
  router.push(`${VUE_APP_BASE_URL}dashboard`);
};
</script>
