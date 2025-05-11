<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-neutral-700 p-0 md:p-4">
    <div class="w-full md:max-w-sm md:h-[85vh] md:max-h-[750px] bg-background shadow-2xl md:rounded-3xl overflow-hidden flex flex-col md:border-8 border-neutral-900">
      <MobileHeader />
      <main class="flex-1 overflow-y-auto">
        <div class="p-4">
          <router-view />
        </div>
      </main>
      <BottomNavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import MobileHeader from './MobileHeader.vue';
import BottomNavigationBar from './BottomNavigationBar.vue';
</script>
