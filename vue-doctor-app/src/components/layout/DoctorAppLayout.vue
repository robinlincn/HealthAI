<template>
  <div class="flex min-h-screen w-full bg-muted/40">
    <DoctorSidebar />
    <div class="flex flex-1 flex-col">
      <DoctorHeader />
      <main class="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 bg-background overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DoctorSidebar from './DoctorSidebar.vue';
import DoctorHeader from './DoctorHeader.vue';
</script>
