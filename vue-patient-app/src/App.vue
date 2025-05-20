<template>
  <div class="flex flex-col min-h-screen">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style>
/* Global styles for App.vue if needed, otherwise main.css handles it */
#app {
  /* Ensure #app fills the viewport height if not already covered by body styles */
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
}
</style>
