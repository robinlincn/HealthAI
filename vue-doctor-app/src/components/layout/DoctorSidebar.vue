<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex h-full transform flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="sidebarClasses"
    v-show="isMobile ? isOpen : true"
  >
    <div class="flex h-16 items-center border-b border-sidebar-border px-4">
      <router-link to="/vue-doctor-app/dashboard" class="flex items-center space-x-2" aria-label="AI慢病管理系统-医生端 Home">
        <LayoutDashboard class="h-8 w-8 text-sidebar-primary" />
        <span 
          class="font-bold text-lg whitespace-nowrap text-sidebar-foreground"
          :class="{ 'hidden': !isOpen && !isMobile, 'md:inline-block': isOpen || !isMobile }"
        >
          医生端
        </span>
      </router-link>
    </div>
    <nav class="flex-1 overflow-y-auto p-2">
      <ul class="space-y-1">
        <template v-for="(item, index) in groupedNavLinks" :key="index">
          <li v-if="item.isLabel" class="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70"
              :class="{ 'text-center': !isOpen && !isMobile }">
            <span :class="{ 'hidden': !isOpen && !isMobile }">{{ item.label }}</span>
            <hr v-if="!isOpen && !isMobile && item.label" class="border-sidebar-border/50 my-1">
          </li>
          <template v-else v-for="link in item.links" :key="link.href">
            <li>
              <router-link
                :to="link.href"
                class="flex items-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                :class="[
                  isActive(link.href) ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold' : 'text-sidebar-foreground/80',
                  { 'justify-center': !isOpen && !isMobile }
                ]"
                @click="handleLinkClick"
                :title="(!isOpen && !isMobile) ? link.title : ''"
              >
                <component :is="link.icon" class="h-5 w-5 flex-shrink-0" :class="{ 'mr-3': isOpen || isMobile }" />
                <span class="truncate" :class="{ 'hidden': !isOpen && !isMobile }">
                  {{ link.title }}
                </span>
              </router-link>
            </li>
          </template>
        </template>
      </ul>
    </nav>
    <div class="mt-auto border-t border-sidebar-border p-2">
      <button
        @click="handleLogout"
        class="flex w-full items-center rounded-md p-2 text-sm font-medium transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        :class="{ 'justify-center': !isOpen && !isMobile }"
        :title="(!isOpen && !isMobile) ? '退出登录' : ''"
      >
        <LogOut class="h-5 w-5 flex-shrink-0" :class="{ 'mr-3': isOpen || isMobile }" />
        <span :class="{ 'hidden': !isOpen && !isMobile }">退出登录</span>
      </button>
    </div>
    <!-- Overlay for mobile when sidebar is open -->
     <div
      v-if="isOpen && isMobile"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="closeSidebarOnMobile"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doctorNavLinksVue } from '@/lib/nav-links-vue-doctor';
import type { NavItemVue } from '@/lib/types-vue';
import { LogOut, LayoutDashboard } from 'lucide-vue-next';

interface GroupedLink {
  isLabel: boolean;
  label?: string;
  links?: NavItemVue[];
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const isMobile = ref(window.innerWidth < 768);

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768;
};

const sidebarClasses = computed(() => ({
  'w-64': props.isOpen || !isMobile.value, // Full width when open or on desktop
  'w-16': !props.isOpen && !isMobile.value, // Collapsed width on desktop
  'translate-x-0 shadow-xl': props.isOpen && isMobile.value, // Open on mobile
  '-translate-x-full': !props.isOpen && isMobile.value, // Closed on mobile
}));

const isActive = (href: string) => {
  if (href === '/vue-doctor-app/dashboard' && route.path === '/vue-doctor-app/dashboard') return true;
  return route.path.startsWith(href) && href !== '/vue-doctor-app/dashboard';
};

const groupedNavLinks = computed((): GroupedLink[] => {
  const groups: Record<string, NavItemVue[]> = {};
  doctorNavLinksVue.forEach(link => {
    const label = link.label || 'General';
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(link);
  });

  const result: GroupedLink[] = [];
  for (const label in groups) {
    if (label !== 'General' || Object.keys(groups).length === 1) {
      result.push({ isLabel: true, label: label });
    }
    result.push({ isLabel: false, links: groups[label] });
  }
  return result;
});

const handleLinkClick = () => {
  if (isMobile.value) {
    emit('toggle-sidebar'); // Close sidebar on mobile after link click
  }
};

const closeSidebarOnMobile = () => {
  if (isMobile.value && props.isOpen) {
    emit('toggle-sidebar');
  }
};

const handleLogout = () => {
  console.log("Logout (Vue Doctor App) - Placeholder");
  // router.push('/vue-doctor-app/auth/login'); // Assuming login route exists
};

onMounted(() => {
  updateMobileStatus();
  window.addEventListener('resize', updateMobileStatus);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus);
});
</script>

<style scoped>
/* Ensure smooth transition for width */
aside {
  transition-property: width, transform;
}
</style>
