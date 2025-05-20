<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <VCard class="shadow-xl">
        <VCardHeader class="space-y-1 text-center p-6">
          <img 
            src="https://picsum.photos/seed/loginbanner-vue/400/150" 
            alt="健康管理" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="health technology"
          />
          <VCardTitle class="text-2xl">欢迎登录 (Vue)</VCardTitle>
          <VCardDescription>
            登录您的AI慢病管理账户
          </VCardDescription>
        </VCardHeader>
        <VCardContent class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-foreground">手机号</label>
              <input
                id="phone"
                type="tel"
                v-model="phone"
                placeholder="请输入您的手机号"
                required
                :disabled="isLoading"
                class="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11"
              />
            </div>
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-foreground">密码</label>
              <input
                id="password"
                type="password"
                v-model="password"
                placeholder="请输入您的密码"
                required
                :disabled="isLoading"
                class="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11"
              />
            </div>
            <button type="submit" class="w-full flex justify-center items-center rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 h-11" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <LogIn v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "登录中..." : "登录" }}
            </button>
          </form>
        </VCardContent>
        <VCardFooter class="flex flex-col items-center p-6 pt-0">
          <p class="text-sm text-muted-foreground">
            还没有账户？
            <RouterLink :to="VUE_APP_BASE_URL + 'auth/register'" class="font-medium text-primary hover:underline">立即注册</RouterLink>
          </p>
          <button class="mt-2 text-xs text-muted-foreground hover:text-primary p-0 h-auto" disabled>
              忘记密码？
          </button>
        </VCardFooter>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { LogIn, Loader2 } from 'lucide-vue-next';
import { VCard, VCardHeader, VCardTitle, VCardDescription, VCardContent, VCardFooter } from '@/components/ui/VCard';

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const router = useRouter();
const authStore = useAuthStore();

const phone = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  // Mock login
  await new Promise(resolve => setTimeout(resolve, 1000));
  authStore.login({ phone: phone.value }); // Simulate login
  // toast a success message - requires a toast system
  console.log("登录成功 (Vue)");
  router.push(VUE_APP_BASE_URL + 'dashboard');
};
</script>
