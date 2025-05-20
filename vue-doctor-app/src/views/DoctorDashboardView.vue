<template>
  <div class="p-1 md:p-4 space-y-6">
    <!-- Welcome Banner Placeholder -->
    <div class="bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold text-primary">欢迎回来, 医生!</h2>
      <p class="text-foreground/80 mt-2">管理您的患者、预约和日常工作。系统致力于提高您的工作效率。</p>
    </div>

    <!-- Stats Cards Placeholder -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.title" class="bg-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between pb-2">
          <h3 class="text-sm font-medium text-foreground">{{ stat.title }}</h3>
          <component :is="stat.icon" class="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div class="text-3xl font-bold text-primary">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground pt-1">{{ stat.description }}</p>
          <a :href="stat.href" class="text-sm text-accent hover:underline mt-2 block">查看详情 &rarr;</a>
        </div>
      </div>
    </div>

    <!-- Patient Alerts Placeholder -->
     <div class="bg-card p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-destructive mb-3 flex items-center">
        <AlertTriangle class="mr-2 h-6 w-6" />
        病人健康预警
      </h3>
      <p class="text-muted-foreground">病人健康预警模块正在建设中。此处将显示健康数据异常的病人列表。</p>
    </div>

    <!-- Activity Log Placeholder -->
    <div class="bg-card p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-foreground mb-3">近期活动日志</h3>
      <p class="text-muted-foreground">近期活动日志模块正在建设中。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarClock, MailWarning, Users, Megaphone, AlertTriangle } from 'lucide-vue-next';

const stats = [
  { title: "今日预约", value: "0", icon: CalendarClock, href: "#", description: "待处理 0"},
  { title: "待处理消息", value: "0", icon: MailWarning, href: "#", description: "新消息 0"},
  { title: "活跃患者", value: "0", icon: Users, href: "#", description: "本周新增 0" },
  { title: "系统公告", value: "0", icon: Megaphone, href: "#", description: "重要通知"},
];
</script>
