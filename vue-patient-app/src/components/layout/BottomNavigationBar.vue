<template>
  <nav class="bg-card border-t border-border sticky bottom-0 z-20 flex-shrink-0">
    <div class="flex justify-around items-center h-16">
      <RouterLink
        v-for="link in bottomNavLinksVue"
        :key="link.title"
        :to="link.href"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          class="flex flex-col items-center justify-center flex-1 p-1 text-center"
          :class="[isActive ? 'text-primary' : 'text-muted-foreground']"
        >
          <component :is="link.icon" class="h-5 w-5 mb-0.5" />
          <span class="text-xs" :class="{ 'font-medium': isActive }">
            {{ link.title }}
          </span>
        </button>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { bottomNavLinksVue } from '@/lib/nav-links-vue';
</script>
