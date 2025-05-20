<template>
  <div class="flex h-screen bg-muted/40">
    <DoctorSidebar :is-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
    <div 
      class="flex flex-1 flex-col transition-all duration-300 ease-in-out"
      :class="{ 'md:ml-64': isSidebarOpen && !isMobile, 'md:ml-16': !isSidebarOpen && !isMobile }"
    >
      <DoctorHeader @toggle-sidebar="toggleSidebar" :sidebar-open="isSidebarOpen" />
      <main class="flex-1 p-4 sm:px-6 sm:py-6 md:p-6 overflow-y-auto bg-background">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import DoctorSidebar from './DoctorSidebar.vue';
import DoctorHeader from './DoctorHeader.vue';
import { useRoute } from 'vue-router';

const isSidebarOpen = ref(true);
const isMobile = ref(window.innerWidth < 768);
const route = useRoute();

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) { // Default to open on desktop
    // isSidebarOpen.value = true; 
  } else { // Default to closed on mobile
    isSidebarOpen.value = false;
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  updateMobileStatus();
  window.addEventListener('resize', updateMobileStatus);
  // Attempt to load sidebar state from localStorage for desktop
  if (!isMobile.value) {
    const storedState = localStorage.getItem('doctorSidebarState');
    if (storedState !== null) {
        isSidebarOpen.value = storedState === 'true';
    } else {
        isSidebarOpen.value = true; // Default open for desktop if no stored state
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus);
});

watch(isSidebarOpen, (newValue) => {
    if (!isMobile.value) { // Only save state for desktop
        localStorage.setItem('doctorSidebarState', String(newValue));
    }
});

// Close sidebar on mobile when route changes
watch(route, () => {
  if (isMobile.value && isSidebarOpen.value) {
    isSidebarOpen.value = false;
  }
});

</script>

<style scoped>
/* Ensure the layout fills the viewport height */
.flex.h-screen {
  min-height: 100vh;
}
</style>
