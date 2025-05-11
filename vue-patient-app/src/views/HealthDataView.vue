<template>
  <div class="space-y-6">
    <div class="bg-card rounded-lg shadow-sm">
      <div class="p-3 border-b">
        <div class="grid grid-cols-2 text-sm h-10">
          <button 
            @click="activeTab = 'view'" 
            :class="['py-2 flex items-center justify-center rounded-t-md', activeTab === 'view' ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted/50']">
            <BarChart3 class="mr-1 h-4 w-4" /> 查看数据
          </button>
          <button 
            @click="activeTab = 'input'" 
            :class="['py-2 flex items-center justify-center rounded-t-md', activeTab === 'input' ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted/50']">
            <Activity class="mr-1 h-4 w-4" /> 手动记录
          </button>
        </div>
      </div>

      <!-- View Data Tab -->
      <div v-if="activeTab === 'view'" class="p-4 space-y-4">
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4"><h3 class="text-base font-semibold">血糖数据趋势</h3></div>
          <div class="p-2 sm:p-4 h-[250px] w-full flex items-center justify-center text-muted-foreground bg-muted/30 rounded-b-lg">
            血糖图表占位符 (建设中)
          </div>
        </div>
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4"><h3 class="text-base font-semibold">血压数据趋势</h3></div>
          <div class="p-2 sm:p-4 h-[250px] w-full flex items-center justify-center text-muted-foreground bg-muted/30 rounded-b-lg">
            血压图表占位符 (建设中)
          </div>
        </div>
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4"><h3 class="text-base font-semibold">体重变化趋势</h3></div>
          <div class="p-2 sm:p-4 h-[250px] w-full flex items-center justify-center text-muted-foreground bg-muted/30 rounded-b-lg">
            体重图表占位符 (建设中)
          </div>
        </div>
         <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4"><h3 class="text-base font-semibold">运动记录</h3></div>
          <div class="p-4">
             <p class="text-muted-foreground text-sm">暂无运动记录 (建设中)。</p>
          </div>
        </div>
      </div>

      <!-- Input Data Tab -->
      <div v-if="activeTab === 'input'" class="p-4 space-y-4">
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4 flex items-center"><Droplets class="mr-2 h-4 w-4 text-primary" /><h3 class="text-base font-semibold">记录血糖</h3></div>
          <div class="p-4">
            <p class="text-sm text-muted-foreground">血糖记录表单 (建设中)</p>
          </div>
        </div>
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4 flex items-center"><HeartPulse class="mr-2 h-4 w-4 text-primary" /><h3 class="text-base font-semibold">记录血压</h3></div>
          <div class="p-4">
            <p class="text-sm text-muted-foreground">血压记录表单 (建设中)</p>
          </div>
        </div>
        <div class="bg-card shadow-sm rounded-lg">
          <div class="p-4 flex items-center"><Scale class="mr-2 h-4 w-4 text-primary" /><h3 class="text-base font-semibold">记录体重</h3></div>
          <div class="p-4">
            <p class="text-sm text-muted-foreground">体重记录表单 (建设中)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BarChart3, Activity, Droplets, Scale, HeartPulse } from 'lucide-vue-next';

const activeTab = ref('view');
</script>
