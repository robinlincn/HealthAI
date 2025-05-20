<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <VCard class="shadow-xl">
        <VCardHeader class="space-y-1 text-center p-6">
          <img 
            src="https://picsum.photos/seed/registerbanner-vue/400/150" 
            alt="健康生活" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="medical icons"
          />
          <VCardTitle class="text-2xl">注册您的专属AI管家 (Vue)</VCardTitle>
          <VCardDescription>
            开启您的个性化慢病管理之旅
          </VCardDescription>
        </VCardHeader>
        <VCardContent class="p-6">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <!-- Form fields (name, age, gender, etc.) go here -->
            <div class="space-y-2">
              <label for="phone-reg" class="block text-sm font-medium text-foreground">手机号</label>
              <input id="phone-reg" type="tel" v-model="formData.phone" placeholder="请输入手机号" required class="input-field" />
            </div>
            <div class="space-y-2">
              <label for="password-reg" class="block text-sm font-medium text-foreground">密码</label>
              <input id="password-reg" type="password" v-model="formData.password" placeholder="请输入密码" required minlength="6" class="input-field" />
            </div>
             <div class="space-y-2">
              <label for="confirmPassword-reg" class="block text-sm font-medium text-foreground">确认密码</label>
              <input id="confirmPassword-reg" type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码" required minlength="6" class="input-field" />
            </div>
            <!-- Add more fields as in Next.js version -->
            <button type="submit" class="w-full btn-primary" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <UserPlus v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "注册中..." : "完成注册" }}
            </button>
          </form>
        </VCardContent>
        <VCardFooter class="flex justify-center p-6 pt-0">
          <p class="text-sm text-muted-foreground">
            已有账户？
            <RouterLink :to="VUE_APP_BASE_URL + 'auth/login'" class="font-medium text-primary hover:underline">立即登录</RouterLink>
          </p>
        </VCardFooter>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { UserPlus, Loader2 } from 'lucide-vue-next';
import { VCard, VCardHeader, VCardTitle, VCardDescription, VCardContent, VCardFooter } from '@/components/ui/VCard';

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';
const router = useRouter();
const formData = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  name: '',
  age: '',
  gender: '',
  concernedDisease: '',
});
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  if (formData.value.password !== formData.value.confirmPassword) {
    // toast error
    console.error("密码不匹配");
    isLoading.value = false;
    return;
  }
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log("注册成功 (Vue)", formData.value);
  router.push(VUE_APP_BASE_URL + 'auth/login');
};
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full rounded-md border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11;
}
.btn-primary {
  @apply flex w-full justify-center items-center rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 h-11;
}
</style>
