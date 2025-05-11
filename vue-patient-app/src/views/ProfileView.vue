<template>
  <div class="space-y-4 pb-4">
    <!-- Top Banner Section -->
    <div class="relative h-40 sm:h-48 md:h-40 rounded-lg overflow-hidden">
      <img
        src="https://picsum.photos/seed/profileheader/600/240"
        alt="健康背景"
        class="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
    </div>

    <!-- User Info and Doctor Card -->
    <div class="relative -mt-20 mx-2 bg-card shadow-xl rounded-lg">
      <div class="p-4 flex items-center space-x-4">
        <div class="flex flex-col items-center">
          <div class="h-20 w-20 border-4 border-background shadow-md rounded-full flex items-center justify-center bg-muted">
            <img v-if="mockUser.avatarUrl" :src="mockUser.avatarUrl" :alt="mockUser.name" class="h-full w-full rounded-full object-cover" />
            <UserCircle v-else :size="48" class="text-muted-foreground"/>
          </div>
          <p class="mt-2 text-lg font-semibold">{{ mockUser.name }}</p>
        </div>

        <div class="self-stretch border-l border-border mx-2 sm:mx-4"></div>

        <div class="flex-1 text-center p-2 border border-primary/30 rounded-lg bg-background">
          <p class="text-sm font-medium text-primary">专属健康管理师</p>
          <div class="h-12 w-12 mx-auto my-1 border-2 border-primary/20 rounded-full flex items-center justify-center bg-muted">
             <img v-if="mockDoctor.avatarUrl" :src="mockDoctor.avatarUrl" :alt="mockDoctor.name" class="h-full w-full rounded-full object-cover" />
            <Stethoscope v-else :size="24" class="text-primary/70"/>
          </div>
          <p class="text-sm text-muted-foreground mb-2">{{ mockDoctor.name }}</p>
          <router-link to="/dashboard/consultations" class="w-full h-8 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1.5 inline-flex items-center justify-center">
            <Stethoscope class="mr-1 h-3 w-3" /> 询问医生
          </router-link>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div class="mx-2 bg-card shadow-lg rounded-lg">
      <ul class="divide-y divide-border">
        <li v-for="linkItem in profileLinks" :key="linkItem.title">
          <router-link
            :to="linkItem.href"
            class="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
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
    <div class="mx-2 bg-card shadow-lg rounded-lg">
      <div class="p-2">
        <button
          @click="handleLogout"
          class="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-medium p-3 rounded-md flex items-center justify-center"
        >
          <LogOut class="mr-2 h-4 w-4" />
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UserCircle, MessageSquare, CheckSquare, Activity, Smile, ChevronRight, LogOut, Stethoscope, FileText } from 'lucide-vue-next';

const mockUser = {
  name: "王小宝 (Vue)",
  avatarUrl: "https://picsum.photos/seed/userprofilemainvue/100/100",
};

const mockDoctor = {
  name: "王老师 (Vue)",
  avatarUrl: "https://picsum.photos/seed/doctorprofilemainvue/80/80",
};

const profileLinks = [
  { title: "健康档案", icon: FileText, href: "/dashboard/profile/edit-details" },
  { title: "在线咨询", icon: MessageSquare, href: "/dashboard/consultations" },
  { title: "我的打卡", icon: CheckSquare, href: "/dashboard/reminders" },
  { title: "健康指数", icon: Activity, href: "/dashboard/health-data" },
  { title: "联系我们", icon: Smile, href: "/dashboard/help" },
];

const router = useRouter();

const handleLogout = () => {
  // Mock logout
  alert('已退出登录 (模拟)');
  router.push('/auth/login');
};
</script>
