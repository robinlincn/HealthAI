<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <VCard class="shadow-xl">
        <VCardHeader class="space-y-1 text-center p-6">
          <img 
            src="https://picsum.photos/seed/registerbanner/400/150" 
            alt="健康生活" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
            data-ai-hint="medical icons"
          />
          <VCardTitle class="text-2xl">注册您的专属AI管家</VCardTitle>
          <VCardDescription>开启您的个性化慢病管理之旅</VCardDescription>
        </VCardHeader>
        <VCardContent class="p-6">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <VLabel for="phone">手机号</VLabel>
              <VInput id="phone" name="phone" type="tel" placeholder="请输入您的手机号" v-model="formData.phone" required :disabled="isLoading" />
            </div>
            <div class="space-y-2">
              <VLabel for="password">密码</VLabel>
              <VInput id="password" name="password" type="password" placeholder="请输入密码 (至少6位)" v-model="formData.password" required minlength="6" :disabled="isLoading" />
            </div>
            <div class="space-y-2">
              <VLabel for="confirmPassword">确认密码</VLabel>
              <VInput id="confirmPassword" name="confirmPassword" type="password" placeholder="请再次输入密码" v-model="formData.confirmPassword" required minlength="6" :disabled="isLoading" />
            </div>
            <div class="space-y-2">
              <VLabel for="name">姓名</VLabel>
              <VInput id="name" name="name" type="text" placeholder="请输入您的姓名" v-model="formData.name" required :disabled="isLoading" />
            </div>
            <div class="space-y-2">
              <VLabel for="age">年龄</VLabel>
              <VInput id="age" name="age" type="number" placeholder="请输入您的年龄" v-model="formData.age" required min="1" max="120" :disabled="isLoading" />
            </div>
            <div class="space-y-2">
              <VLabel for="gender">性别</VLabel>
              <VSelect id="gender" name="gender" v-model="formData.gender" required :disabled="isLoading">
                <option value="" disabled selected>请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </VSelect>
            </div>
            <div class="space-y-2">
              <VLabel for="concernedDisease">关注病种</VLabel>
              <VSelect id="concernedDisease" name="concernedDisease" v-model="formData.concernedDisease" required :disabled="isLoading">
                <option value="" disabled selected>请选择您关注的病种</option>
                <option value="diabetes">糖尿病</option>
                <option value="hypertension">高血压</option>
                <option value="hyperlipidemia">高血脂</option>
                <option value="copd">慢阻肺</option>
                <option value="other">其他</option>
              </VSelect>
            </div>
            <VButton type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <UserPlus v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "注册中..." : "完成注册" }}
            </VButton>
          </form>
        </VCardContent>
        <VCardFooter class="flex justify-center p-6 pt-0">
          <p class="text-sm text-muted-foreground">
            已有账户？
            <router-link :to="loginPath" class="text-primary hover:underline p-0 h-auto">立即登录</router-link>
          </p>
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
import VSelect from '@/components/ui/VSelect.vue'; // Basic select component
import { Loader2, UserPlus } from 'lucide-vue-next';

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const router = useRouter();
const formData = ref({
  phone: "",
  password: "",
  confirmPassword: "",
  name: "",
  age: "",
  gender: "",
  concernedDisease: "",
});
const isLoading = ref(false);

const loginPath = `${VUE_APP_BASE_URL}auth/login`;

const handleRegister = async () => {
  isLoading.value = true;
  if (formData.value.password !== formData.value.confirmPassword) {
    alert("两次输入的密码不一致。"); // Replace with toast in real app
    isLoading.value = false;
    return;
  }
  // Mock registration logic
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("Registration data:", formData.value);
  alert("注册成功 (模拟)，即将跳转到登录页面。"); // Replace with toast
  router.push(loginPath);
};
</script>
