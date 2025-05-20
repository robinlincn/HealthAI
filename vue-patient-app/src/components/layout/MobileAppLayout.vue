<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-700 p-0 md:p-4">
    <div class="w-full md:max-w-sm md:h-[calc(var(--vh,1vh)*85)] md:max-h-[750px] bg-background shadow-2xl md:rounded-3xl overflow-hidden flex flex-col md:border-8 border-neutral-900">
      <MobileHeader />
      <main class="flex-1 overflow-y-auto">
        <div class="p-4">
          <RouterView />
        </div>
      </main>
      <BottomNavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import MobileHeader from './MobileHeader.vue';
import BottomNavigationBar from './BottomNavigationBar.vue';
import { onMounted, onUnmounted } from 'vue';

const setVhVariable = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

onMounted(() => {
  setVhVariable();
  window.addEventListener('resize', setVhVariable);
});

onUnmounted(() => {
  window.removeEventListener('resize', setVhVariable);
});
</script>
