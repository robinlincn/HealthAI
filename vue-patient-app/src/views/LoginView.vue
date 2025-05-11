<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <VCard class="shadow-xl">
        <VCardHeader class="space-y-1 text-center p-6">
          <img 
            src="https://picsum.photos/seed/loginbanner/400/150" 
            alt="健康管理" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="health technology"
          />
          <VCardTitle class="text-2xl">欢迎登录</VCardTitle>
          <VCardDescription>登录您的AI慢病管理账户</VCardDescription>
        </VCardHeader>
        <VCardContent class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <VLabel for="phone">手机号</VLabel>
              <VInput
                id="phone"
                type="tel"
                placeholder="请输入您的手机号"
                v-model="phone"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <VLabel for="password">密码</VLabel>
              <VInput
                id="password"
                type="password"
                placeholder="请输入您的密码"
                v-model="password"
                required
                :disabled="isLoading"
              />
            </div>
            <VButton type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <LogIn v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "登录中..." : "登录" }}
            </VButton>
          </form>
        </VCardContent>
        <VCardFooter class="flex flex-col items-center p-6 pt-0">
          <p class="text-sm text-muted-foreground">
            还没有账户？
            <router-link :to="registerPath" class="text-primary hover:underline p-0 h-auto">立即注册</router-link>
          </p>
          <VButton variant="link" class="mt-2 text-xs p-0 h-auto" disabled>
            忘记密码？
          </VButton>
        </VCardFooter>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { VCard, VCardContent, VCardHeader, VCardTitle, VCardDescription, VCardFooter } from '@/components/ui/VCard';
import VButton from '@/components/ui/VButton.vue';
import VInput from '@/components/ui/VInput.vue';
import VLabel from '@/components/ui/VLabel.vue';
import { Loader2, LogIn } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore'; // Assuming an auth store

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const router = useRouter();
const authStore = useAuthStore();
const phone = ref("");
const password = ref("");
const isLoading = ref(false);

const registerPath = `${VUE_APP_BASE_URL}auth/register`;
const dashboardPath = `${VUE_APP_BASE_URL}dashboard`;

const handleLogin = async () => {
  isLoading.value = true;
  // Mock login logic
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  authStore.login({ phone: phone.value }); // Mock login success
  // In a real app, you would use toast for success/error messages
  // toast({ title: "登录成功", description: "欢迎回来！即将跳转到仪表盘。" });
  alert("登录成功 (模拟)");
  router.push(dashboardPath);
  
  isLoading.value = false;
};
</script>
