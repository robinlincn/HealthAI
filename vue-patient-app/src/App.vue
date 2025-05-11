<template>
  <router-view />
</template>

<script setup lang="ts">
// This is the main App component.
// Global layout logic can go here if needed, or be handled by router-view.
</script>

<style>
/* Global styles can be added here or in main.css */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: hsl(var(--background)); /* Ensure background color is applied */
  color: hsl(var(--foreground));
}
</style>
