<template>
  <div class="space-y-4">
    <!-- Welcome Banner -->
    <VCard class="shadow-md overflow-hidden bg-card">
      <VCardContent class="p-4 flex items-center space-x-4">
        <VAvatar class="h-16 w-16 border-2 border-primary/30">
          <VAvatarImage :src="mockUserData.avatarUrl" :alt="mockUserData.name" :data-ai-hint="mockUserData.dataAiHint" />
          <VAvatarFallback class="text-xl"><UserCircle :size="36"/></VAvatarFallback>
        </VAvatar>
        <div class="flex-1">
          <VCardTitle class="text-xl font-semibold text-foreground">
            欢迎回来, {{ mockUserData.name }}! (Vue)
          </VCardTitle>
          <VCardDescription class="text-sm text-muted-foreground flex items-center mt-1">
            <Stethoscope class="h-4 w-4 mr-1.5 text-primary" />
            您的主治医生: {{ mockUserData.managingDoctor }}
          </VCardDescription>
        </div>
      </VCardContent>
    </VCard>

    <!-- Overview Data -->
    <VCard class="shadow-sm">
      <VCardHeader class="p-4 pb-2">
        <VCardTitle class="text-base font-medium">今日概览</VCardTitle>
        <VCardDescription class="text-xs">您的健康数据摘要 (示例)。</VCardDescription>
      </VCardHeader>
      <VCardContent class="p-4 grid grid-cols-2 gap-3">
        <RouterLink v-for="item in overviewData" :key="item.title" :to="item.href" class="block">
          <VCard class="shadow-xs hover:shadow-md transition-shadow bg-muted/30 h-full flex flex-col">
            <VCardHeader class="p-2.5 pb-1">
              <div class="flex items-center space-x-1.5">
                <component :is="item.icon" class="h-4 w-4" :class="item.color || 'text-primary'" />
                <VCardTitle class="text-sm font-medium">{{ item.title }}</VCardTitle>
              </div>
            </VCardHeader>
            <VCardContent class="p-2.5 pt-0 flex-grow">
              <p class="text-xl font-semibold">{{ item.value }} <span class="text-xs text-muted-foreground">{{ item.unit }}</span></p>
              <p class="text-xs text-muted-foreground">{{ item.description }}</p>
            </VCardContent>
          </VCard>
        </RouterLink>
      </VCardContent>
      <VCardContent class="p-4 pt-0">
        <p class="text-xs text-muted-foreground text-center">数据为模拟，请及时记录真实数据以获得准确分析。</p>
      </VCardContent>
    </VCard>

    <!-- Quick Access Links -->
    <div class="space-y-3">
      <VCardHeader class="px-0 pt-2 pb-1">
           <VCardTitle class="text-base font-medium">常用功能</VCardTitle>
      </VCardHeader>
      <RouterLink v-for="link in quickAccessLinks" :key="link.title" :to="link.href" class="block">
          <VCard class="hover:shadow-md active:bg-muted/60 transition-all shadow-sm">
            <VCardContent class="p-3 flex items-center space-x-3">
                <component :is="link.icon" class="h-6 w-6 text-primary flex-shrink-0" />
                <span class="text-sm font-semibold text-foreground">{{ link.title }}</span>
            </VCardContent>
          </VCard>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription } from '@/components/ui/VCard';
import { VAvatar, VAvatarImage, VAvatarFallback } from '@/components/ui/VAvatar';
import { UserCircle, Stethoscope, Droplets, HeartPulse, Scale, Footprints } from 'lucide-vue-next';
import { navLinksVue } from '@/lib/nav-links-vue';
import { computed } from 'vue';

const mockUserData = {
  name: "示例用户",
  avatarUrl: "https://picsum.photos/seed/useravatar-vue/100/100",
  dataAiHint: "user avatar",
  managingDoctor: "王医生",
};

const overviewData = [
  { title: "血糖", value: "5.8", unit: "mmol/L", description: "餐前", icon: Droplets, color: "text-blue-500", href: "/vue-patient-app/dashboard/health-data" },
  { title: "血压", value: "125/80", unit: "mmHg", description: "最新记录", icon: HeartPulse, color: "text-red-500", href: "/vue-patient-app/dashboard/health-data" },
  { title: "体重", value: "70.2", unit: "kg", description: "稳定", icon: Scale, color: "text-green-500", href: "/vue-patient-app/dashboard/health-data" },
  { title: "今日步数", value: "3450", unit: "步", description: "加油！", icon: Footprints, color: "text-orange-500", href: "/vue-patient-app/dashboard/health-data" },
];

const quickAccessLinks = computed(() => 
  navLinksVue.filter(link =>
    link.href !== '/vue-patient-app/dashboard' &&
    (link.href === '/vue-patient-app/dashboard/health-data' ||
     link.href === '/vue-patient-app/dashboard/nutrition' ||
     link.href === '/vue-patient-app/dashboard/medication-plan' ||
     link.href === '/vue-patient-app/dashboard/reports' ||
     link.href === '/vue-patient-app/dashboard/reminders' ||
     link.href === '/vue-patient-app/dashboard/consultations')
  ).slice(0, 5)
);
</script>
