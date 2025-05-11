<template>
  <div class="space-y-6">
    <div class="bg-card shadow-sm rounded-lg">
      <div class="p-3 border-b">
        <div class="grid grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm h-auto">
          <button 
            v-for="tab in tabs" :key="tab.value"
            @click="activeTab = tab.value"
            :class="['px-1 py-2 sm:px-3 flex items-center justify-center rounded-t-md', activeTab === tab.value ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted/50']">
            <component :is="tab.icon" class="mr-1 h-4 w-4" /> {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="p-4">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basicInfo'">
          <div class="bg-card shadow-sm rounded-lg">
            <div class="p-4">
              <h2 class="text-base font-semibold">基本信息</h2>
              <p class="text-xs text-muted-foreground">管理您的姓名、联系方式等个人信息。</p>
            </div>
            <div class="p-4 space-y-4">
              <p class="text-sm text-muted-foreground">基本信息表单 (建设中)</p>
            </div>
          </div>
        </div>

        <!-- Medical History Tab -->
        <div v-if="activeTab === 'medicalHistory'">
          <div class="bg-card shadow-sm rounded-lg">
            <div class="p-4">
              <h2 class="text-base font-semibold">病史与症状</h2>
              <p class="text-xs text-muted-foreground">管理您的家族病史、现有症状等信息。</p>
            </div>
            <div class="p-4 space-y-4">
              <p class="text-sm text-muted-foreground">病史与症状表单 (建设中)</p>
            </div>
          </div>
        </div>
        
        <!-- Emergency Contacts Tab -->
        <div v-if="activeTab === 'emergencyContacts'">
          <div class="bg-card shadow-sm rounded-lg">
            <div class="p-4">
              <h2 class="text-base font-semibold">紧急联系人</h2>
              <p class="text-xs text-muted-foreground">管理您的紧急联系人信息。</p>
            </div>
            <div class="p-4 space-y-4">
              <p class="text-sm text-muted-foreground">紧急联系人表单 (建设中)</p>
            </div>
          </div>
        </div>

        <!-- Uploaded Reports Tab -->
        <div v-if="activeTab === 'uploadedReports'">
          <div class="bg-card shadow-sm rounded-lg">
            <div class="p-4">
              <h2 class="text-base font-semibold">已上传的检查报告</h2>
              <p class="text-xs text-muted-foreground">在此处查看和管理您已上传的检查报告。</p>
            </div>
            <div class="p-4 space-y-4">
               <p class="text-sm text-muted-foreground">报告列表 (建设中)</p>
               <div class="text-center mt-4">
                <router-link to="/dashboard/reports" class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
                  前往报告中心上传新报告
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserCircle, HeartHandshake, ShieldAlert, FileText } from 'lucide-vue-next';

const activeTab = ref('basicInfo');

const tabs = [
  { name: '基本信息', value: 'basicInfo', icon: UserCircle },
  { name: '病史症状', value: 'medicalHistory', icon: HeartHandshake },
  { name: '紧急联系', value: 'emergencyContacts', icon: ShieldAlert },
  { name: '已上传报告', value: 'uploadedReports', icon: FileText },
];
</script>
