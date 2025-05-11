<template>
  <div class="space-y-4">
    <WelcomeBanner />

    <div class="bg-card shadow-sm rounded-lg">
      <div class="p-4 pb-2">
        <h2 class="text-base font-medium">今日概览</h2>
        <p class="text-xs text-muted-foreground">您的健康数据摘要 (示例)。</p>
      </div>
      <div class="p-4 grid grid-cols-2 gap-3">
        <div v-for="item in overviewData" :key="item.title" class="bg-muted/30 shadow-xs hover:shadow-md transition-shadow rounded-lg">
          <div class="p-2.5 pb-1">
            <div class="flex items-center space-x-1.5">
              <component :is="item.icon" :class="['h-4 w-4', item.color || 'text-primary']" />
              <h3 class="text-sm font-medium">{{ item.title }}</h3>
            </div>
          </div>
          <div class="p-2.5 pt-0">
            <p class="text-xl font-semibold">{{ item.value }} <span class="text-xs text-muted-foreground">{{ item.unit }}</span></p>
            <p class="text-xs text-muted-foreground">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="p-4 pt-0">
        <p class="text-xs text-muted-foreground text-center">数据为模拟，请及时记录真实数据以获得准确分析。</p>
      </div>
    </div>

    <div class="space-y-3">
      <div class="px-0 pt-2 pb-1">
        <h2 class="text-base font-medium">常用功能</h2>
      </div>
      <router-link v-for="link in quickAccessLinks" :key="link.title" :to="link.href" class="block">
        <div class="bg-card hover:shadow-md active:bg-muted/60 transition-all shadow-sm rounded-lg">
          <div class="p-4 flex items-center space-x-4">
            <component :is="link.icon" class="h-7 w-7 text-primary flex-shrink-0" />
            <span class="text-base font-semibold text-foreground">{{ link.title }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue';
import { Droplets, HeartPulse, Scale, Footprints } from 'lucide-vue-next';
import { navLinks } from '@/lib/nav-links-vue';
import type { NavItemVue } from '@/lib/types-vue';

const overviewData = [
  { title: "血糖", value: "5.8", unit: "mmol/L", description: "餐前", icon: Droplets, color: "text-blue-500" },
  { title: "血压", value: "125/80", unit: "mmHg", description: "最新记录", icon: HeartPulse, color: "text-red-500" },
  { title: "体重", value: "70.2", unit: "kg", description: "稳定", icon: Scale, color: "text-green-500" },
  { title: "今日步数", value: "3450", unit: "步", description: "加油！", icon: Footprints, color: "text-orange-500" },
];

const quickAccessLinks: NavItemVue[] = navLinks.filter(link =>
  link.href !== '/dashboard' &&
  (link.href === '/dashboard/health-data' ||
   link.href === '/dashboard/nutrition' ||
   link.href === '/dashboard/reports' ||
   link.href === '/dashboard/reminders' ||
   link.href === '/dashboard/consultations')
).slice(0, 5);
</script>
