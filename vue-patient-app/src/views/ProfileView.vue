<template>
  <div class="space-y-4 pb-4">
    <!-- Top Banner Section -->
    <div class="relative h-40 sm:h-48 md:h-40 rounded-lg overflow-hidden bg-primary/20">
      <img
        src="https://picsum.photos/seed/profileheadervue/600/240"
        alt="健康背景"
        class="absolute inset-0 w-full h-full object-cover opacity-80"
        data-ai-hint="health medical"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
    </div>

    <!-- User Info and Doctor Card -->
    <div class="relative -mt-20 mx-2 rounded-lg border bg-card text-card-foreground shadow-xl p-4">
      <div class="flex items-center space-x-4">
        <div class="flex flex-col items-center">
          <div class="h-20 w-20 rounded-full border-4 border-background shadow-md overflow-hidden bg-muted flex items-center justify-center">
            <img v-if="mockUser.avatarUrl" :src="mockUser.avatarUrl" :alt="mockUser.name" :data-ai-hint="mockUser.dataAiHint" class="h-full w-full object-cover" />
            <span v-else class="text-2xl text-muted-foreground">{{ mockUser.name.substring(0, 1) }}</span>
          </div>
          <p class="mt-2 text-lg font-semibold">{{ mockUser.name }}</p>
        </div>

        <div class="h-20 border-l border-border mx-2 sm:mx-4"></div>

        <div class="flex-1 text-center p-2 border border-primary/30 rounded-lg bg-background">
          <p class="text-sm font-medium text-primary">专属健康管理师</p>
          <div class="h-12 w-12 rounded-full mx-auto my-1 border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center">
            <img v-if="mockDoctor.avatarUrl" :src="mockDoctor.avatarUrl" :alt="mockDoctor.name" :data-ai-hint="mockDoctor.dataAiHint" class="h-full w-full object-cover"/>
            <span v-else class="text-muted-foreground">{{ mockDoctor.name.substring(0,1) }}</span>
          </div>
          <p class="text-sm text-muted-foreground mb-2">{{ mockDoctor.name }}</p>
          <router-link to="/dashboard/consultations" class="w-full h-8 text-xs bg-green-500 hover:bg-green-600 text-white inline-flex items-center justify-center rounded-md px-3 py-1.5">
            <Stethoscope class="mr-1 h-3 w-3" /> 询问医生
          </router-link>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div class="mx-2 rounded-lg border bg-card text-card-foreground shadow-lg">
      <ul class="divide-y divide-border">
        <li v-for="linkItem in profileLinks" :key="linkItem.title">
          <router-link :to="linkItem.href" class="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div class="flex items-center space-x-3">
              <component :is="linkItem.icon" class="h-5 w-5 text-primary" />
              <span class="text-sm font-medium">{{ linkItem.title }}</span>
            </div>
            <ChevronRight class="h-5 w-5 text-muted-foreground" />
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Logout Button -->
    <div class="mx-2 rounded-lg border bg-card text-card-foreground shadow-lg p-2">
       <button @click="handleLogout" class="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-medium flex items-center justify-center p-2 rounded-md">
        <LogOut class="mr-2 h-4 w-4" />
        退出登录
      </button>
    </div>
     <div class="p-4 text-center">
        <p class="text-xs text-muted-foreground">我的页面功能正在逐步完善中。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Stethoscope, FileText, MessageSquare, CheckSquare, Activity, Smile, ChevronRight, LogOut } from 'lucide-vue-next';

const router = useRouter();

const mockUser = {
  name: "王小宝 (Vue)",
  avatarUrl: "https://picsum.photos/seed/userprofilevue/100/100",
  dataAiHint: "user portrait",
};

const mockDoctor = {
  name: "刘医生",
  avatarUrl: "https://picsum.photos/seed/doctorprofilevue/80/80",
  dataAiHint: "doctor professional",
};

const profileLinks = [
  { title: "健康档案", icon: FileText, href: "/dashboard/profile/edit-details" },
  { title: "在线咨询", icon: MessageSquare, href: "/dashboard/consultations" },
  { title: "我的打卡", icon: CheckSquare, href: "/dashboard/reminders" },
  { title: "健康指数", icon: Activity, href: "/dashboard/health-data" },
  { title: "联系我们", icon: Smile, href: "/dashboard/help" },
];

const handleLogout = () => {
  // Mock logout
  console.log("User logged out (mock)");
  router.push("/auth/login");
};
</script>
