<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
    <div class="w-full max-w-md">
      <div class="bg-card shadow-xl rounded-lg">
        <div class="p-6 text-center space-y-1">
           <img 
            src="https://picsum.photos/seed/registerbanner/400/150" 
            alt="健康生活" 
            class="rounded-t-lg object-cover w-full h-32 mb-4"
          />
          <h1 class="text-2xl font-semibold">注册您的专属AI管家</h1>
          <p class="text-sm text-muted-foreground">开启您的个性化慢病管理之旅</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium text-foreground">手机号</label>
              <input id="phone" type="tel" v-model="formData.phone" placeholder="请输入您的手机号" required :disabled="isLoading" class="input-field" />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-foreground">密码</label>
              <input id="password" type="password" v-model="formData.password" placeholder="请输入密码 (至少6位)" required minlength="6" :disabled="isLoading" class="input-field" />
            </div>
            <div class="space-y-2">
              <label for="confirmPassword" class="text-sm font-medium text-foreground">确认密码</label>
              <input id="confirmPassword" type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码" required minlength="6" :disabled="isLoading" class="input-field" />
            </div>
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium text-foreground">姓名</label>
              <input id="name" type="text" v-model="formData.name" placeholder="请输入您的姓名" required :disabled="isLoading" class="input-field" />
            </div>
             <div class="space-y-2">
              <label for="age" class="text-sm font-medium text-foreground">年龄</label>
              <input id="age" type="number" v-model="formData.age" placeholder="请输入您的年龄" required min="1" max="120" :disabled="isLoading" class="input-field" />
            </div>
            <div class="space-y-2">
              <label for="gender" class="text-sm font-medium text-foreground">性别</label>
              <select id="gender" v-model="formData.gender" required :disabled="isLoading" class="select-field">
                <option disabled value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="space-y-2">
              <label for="concernedDisease" class="text-sm font-medium text-foreground">关注病种</label>
               <select id="concernedDisease" v-model="formData.concernedDisease" required :disabled="isLoading" class="select-field">
                <option disabled value="">请选择您关注的病种</option>
                <option value="diabetes">糖尿病</option>
                <option value="hypertension">高血压</option>
                <option value="hyperlipidemia">高血脂</option>
                <option value="copd">慢阻肺</option>
                <option value="other">其他</option>
              </select>
            </div>
            <button type="submit" class="w-full h-10 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <UserPlus v-else class="mr-2 h-4 w-4" />
              {{ isLoading ? "注册中..." : "完成注册" }}
            </button>
          </form>
        </div>
        <div class="p-6 pt-0 flex justify-center">
          <p class="text-sm text-muted-foreground">
            已有账户？
            <router-link to="/auth/login" class="text-primary hover:underline">立即登录</router-link>
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
  name: '',
  age: '',
  gender: '',
  concernedDisease: '',
});
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('两次输入的密码不一致。'); // Replace with actual toast/notification
    isLoading.value = false;
    return;
  }
  // Mock registration logic
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Registration data:', formData.value);
  alert('注册成功 (模拟)'); // Replace with actual toast/notification
  router.push('/auth/login');
  isLoading.value = false;
};
</script>

<style scoped>
.input-field {
  @apply w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring;
}
.select-field {
  @apply w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background;
}
</style>
