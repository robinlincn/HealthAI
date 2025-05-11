<template>
  <div class="space-y-4">
    <WelcomeBanner />

    <VCard class="shadow-sm">
      <VCardHeader class="p-4 pb-2">
        <VCardTitle class="text-base font-medium">今日概览</VCardTitle>
        <VCardDescription class="text-xs">您的健康数据摘要 (示例)。</VCardDescription>
      </VCardHeader>
      <VCardContent class="p-4 grid grid-cols-2 gap-3">
        <VCard v-for="item in overviewData" :key="item.title" class="shadow-xs hover:shadow-md transition-shadow bg-muted/30">
          <VCardHeader class="p-2.5 pb-1">
            <div class="flex items-center space-x-1.5">
              <component :is="item.icon" :class="['h-4 w-4', item.color || 'text-primary']" />
              <VCardTitle class="text-sm font-medium">{{ item.title }}</VCardTitle>
            </div>
          </VCardHeader>
          <VCardContent class="p-2.5 pt-0">
            <p class="text-xl font-semibold">{{ item.value }} <span class="text-xs text-muted-foreground">{{ item.unit }}</span></p>
            <p class="text-xs text-muted-foreground">{{ item.description }}</p>
          </VCardContent>
        </VCard>
      </VCardContent>
      <VCardContent class="p-4 pt-0">
        <p class="text-xs text-muted-foreground text-center">数据为模拟，请及时记录真实数据以获得准确分析。</p>
      </VCardContent>
    </VCard>

    <div class="space-y-3">
      <VCardHeader class="px-0 pt-2 pb-1">
        <VCardTitle class="text-base font-medium">常用功能</VCardTitle>
      </VCardHeader>
      <router-link v-for="link in quickAccessLinks" :key="link.title" :to="link.href" custom v-slot="{ navigate }">
        <div @click="navigate" class="block cursor-pointer">
          <VCard class="hover:shadow-md active:bg-muted/60 transition-all shadow-sm">
            <VCardContent class="p-4 flex items-center space-x-4">
              <component :is="link.icon" class="h-7 w-7 text-primary flex-shrink-0" />
              <span class="text-base font-semibold text-foreground">{{ link.title }}</span>
            </VCardContent>
          </VCard>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue';
import { navLinksVue } from '@/lib/nav-links-vue';
import { Droplets, HeartPulse, Scale, Footprints } from 'lucide-vue-next';

const quickAccessLinks = computed(() => 
  navLinksVue.filter(link =>
    link.href !== '/vue-patient-app/dashboard' &&
    (link.href === '/vue-patient-app/dashboard/health-data' ||
     link.href === '/vue-patient-app/dashboard/nutrition' ||
     link.href === '/vue-patient-app/dashboard/reports' ||
     link.href === '/vue-patient-app/dashboard/reminders' ||
     link.href === '/vue-patient-app/dashboard/consultations')
  ).slice(0, 5)
);

const overviewData = [
  { title: "血糖", value: "5.8", unit: "mmol/L", description: "餐前", icon: Droplets, color: "text-blue-500" },
  { title: "血压", value: "125/80", unit: "mmHg", description: "最新记录", icon: HeartPulse, color: "text-red-500" },
  { title: "体重", value: "70.2", unit: "kg", description: "稳定", icon: Scale, color: "text-green-500" },
  { title: "今日步数", value: "3450", unit: "步", description: "加油！", icon: Footprints, color: "text-orange-500" },
];
</script>
