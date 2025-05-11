<template>
  <div class="space-y-4">
    <WelcomeBanner />

    <div class="p-0">
      <h2 class="text-base font-medium mb-2 px-0">今日概览</h2>
      <p class="text-xs text-muted-foreground mb-3 px-0">您的健康数据摘要 (示例)。</p>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="item in overviewData" :key="item.title"
          class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow bg-muted/30 p-2.5">
          <div class="flex items-center space-x-1.5 mb-1">
            <component :is="item.icon" :class="`h-4 w-4 ${item.color || 'text-primary'}`" />
            <h3 class="text-sm font-medium">{{ item.title }}</h3>
          </div>
          <div>
            <p class="text-xl font-semibold">{{ item.value }} <span class="text-xs text-muted-foreground">{{ item.unit
                }}</span></p>
            <p class="text-xs text-muted-foreground">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <p class="text-xs text-muted-foreground text-center mt-3">数据为模拟，请及时记录真实数据以获得准确分析。</p>
    </div>

    <div class="space-y-3 pt-2">
      <h2 class="text-base font-medium mb-1 px-0">常用功能</h2>
      <router-link v-for="link in quickAccessLinks" :key="link.title" :to="link.href">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md active:bg-muted/60 transition-all p-4 flex items-center space-x-4 mb-3">
          <component :is="link.icon" class="h-7 w-7 text-primary flex-shrink-0" />
          <span class="text-base font-semibold text-foreground">{{ link.title }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue';
import { navLinks } from '@/lib/nav-links-vue';
import { Droplets, HeartPulse, Scale, Footprints } from 'lucide-vue-next';
import { computed } from 'vue';

const overviewData = [
  { title: "血糖", value: "5.8", unit: "mmol/L", description: "餐前", icon: Droplets, color: "text-blue-500" },
  { title: "血压", value: "125/80", unit: "mmHg", description: "最新记录", icon: HeartPulse, color: "text-red-500" },
  { title: "体重", value: "70.2", unit: "kg", description: "稳定", icon: Scale, color: "text-green-500" },
  { title: "今日步数", value: "3450", unit: "步", description: "加油！", icon: Footprints, color: "text-orange-500" },
];

const quickAccessLinks = computed(() =>
  navLinks.filter(link =>
    link.href !== '/dashboard' &&
    (link.href === '/dashboard/health-data' ||
      link.href === '/dashboard/nutrition' ||
      link.href === '/dashboard/reports' ||
      link.href === '/dashboard/reminders' ||
      link.href === '/dashboard/consultations')
  ).slice(0, 5)
);
</script>

<style scoped>
/* Add any specific styles if needed */
</style>