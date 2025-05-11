<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

console.log('%c[Vue Patient App] App.vue script setup executed', 'color: purple;');

onMounted(() => {
  console.log('%c[Vue Patient App] App.vue component has been mounted.', 'color: purple; font-weight: bold;');
});
</script>

<style>
/* Global styles can be imported here or in main.css */
/* @import '@/assets/main.css'; already imported in main.ts */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: hsl(var(--background)); /* Ensure background is applied */
}
</style>
