<template>
  <div id="vue-app-container" class="h-full">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// This is the main entry point for the Vue application.
// It will render the content based on the current route.
</script>

<style>
/* Ensure html, body, and the app container take full height */
html, body, #app, #vue-app-container {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: hsl(var(--background)); /* Apply background to body for consistency */
}
</style>
