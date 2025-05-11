<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <div class="bg-card shadow-xl rounded-lg p-6">
        <div class="space-y-1 text-center mb-6">
          <img 
            src="https://picsum.photos/seed/registerbanner_vue/400/150" 
            alt="健康生活" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="medical icons"
          />
          <h1 class="text-2xl font-semibold">注册您的专属AI管家 (Vue)</h1>
          <p class="text-sm text-muted-foreground">开启您的个性化慢病管理之旅</p>
        </div>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="phone" class="block text-sm font-medium">手机号</label>
            <input type="tel" id="phone" v-model="formData.phone" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="请输入您的手机号" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium">密码</label>
            <input type="password" id="password" v-model="formData.password" required minlength="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="请输入密码 (至少6位)" />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium">确认密码</label>
            <input type="password" id="confirmPassword" v-model="formData.confirmPassword" required minlength="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="请再次输入密码" />
          </div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <UserPlus v-else class="mr-2 h-4 w-4" />
            {{ isLoading ? "注册中..." : "完成注册" }}
          </button>
        </form>
         <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            已有账户？
            <router-link to="/auth/login" class="font-medium text-primary hover:text-primary/80">
              立即登录
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
import { Loader2, UserPlus } from 'lucide-vue-next';

const router = useRouter();
const formData = ref({
  phone: '',
  password: '',
  confirmPassword: '',
});
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('注册失败: 两次输入的密码不一致。');
    isLoading.value = false;
    return;
  }
  // Mock registration logic
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Registration data:', formData.value);
  alert('注册成功 (模拟)! 即将跳转到登录页面。');
  router.push('/auth/login');
  isLoading.value = false;
};
</script>
