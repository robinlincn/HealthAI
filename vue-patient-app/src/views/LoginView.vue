<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <div class="bg-card shadow-xl rounded-lg p-6">
        <div class="space-y-1 text-center mb-6">
          <img 
            src="https://picsum.photos/seed/loginbanner_vue/400/150" 
            alt="健康管理" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="health technology"
          />
          <h1 class="text-2xl font-semibold">欢迎登录 (Vue)</h1>
          <p class="text-sm text-muted-foreground">登录您的AI慢病管理账户</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-gray-700">手机号</label>
            <input
              id="phone"
              type="tel"
              v-model="phone"
              placeholder="请输入您的手机号"
              required
              :disabled="isLoading"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="请输入您的密码"
              required
              :disabled="isLoading"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <LogIn v-else class="mr-2 h-4 w-4" />
            {{ isLoading ? "登录中..." : "登录" }}
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            还没有账户？
            <router-link to="/auth/register" class="font-medium text-primary hover:text-primary/80">
              立即注册
            </router-link>
          </p>
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
  console.log('Login attempt with:', phone.value, password.value);
  // alert('登录成功 (模拟)! 即将跳转到仪表盘。');
  router.push('/dashboard');
  isLoading.value = false;
};
</script>
