<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <div class="bg-card shadow-xl rounded-lg">
        <div class="p-6 text-center space-y-1">
          <img 
            src="https://picsum.photos/seed/loginbanner/400/150" 
            alt="健康管理" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
          />
          <h1 class="text-2xl font-semibold">欢迎登录</h1>
          <p class="text-sm text-muted-foreground">登录您的AI慢病管理账户</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium text-foreground">手机号</label>
              <input
                id="phone"
                type="tel"
                placeholder="请输入您的手机号"
                v-model="phone"
                required
                :disabled="isLoading"
                class="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-foreground">密码</label>
              <input
                id="password"
                type="password"
                placeholder="请输入您的密码"
                v-model="password"
                required
                :disabled="isLoading"
                class="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              class="w-full h-10 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <LogIn v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "登录中..." : "登录" }}
            </button>
          </form>
        </div>
        <div class="p-6 pt-0 flex flex-col items-center">
          <p class="text-sm text-muted-foreground">
            还没有账户？
            <router-link to="/auth/register" class="text-primary hover:underline">立即注册</router-link>
          </p>
          <button class="mt-2 text-xs text-muted-foreground hover:text-primary p-0 h-auto" disabled>
              忘记密码？
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2, LogIn } from 'lucide-vue-next';

const router = useRouter();
const phone = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  // Mock login logic
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate successful login
  alert('登录成功 (模拟)'); // Replace with actual toast/notification
  router.push('/dashboard');
  isLoading.value = false;
};
</script>
