<template>
  <div class="flex flex-col h-full">
    <p class="text-muted-foreground p-4 text-center">AI小助手聊天界面正在建设中 (Vue版)。</p>
    <!-- Basic chat UI structure -->
    <div class="flex-grow overflow-y-auto p-4 space-y-2 bg-muted/30">
      <!-- Placeholder messages -->
      <div class="flex justify-start">
        <div class="bg-card p-2 rounded-lg max-w-[80%]">AI: 你好！有什么可以帮您？</div>
      </div>
      <div class="flex justify-end">
        <div class="bg-primary text-primary-foreground p-2 rounded-lg max-w-[80%]">我：我想问一下...</div>
      </div>
    </div>
    <div class="border-t p-2 space-y-1">
      <div class="flex items-center space-x-1">
        <input type="text" placeholder="输入您的问题..." class="flex-grow border p-2 rounded-md h-10 text-sm" />
        <button class="bg-primary text-primary-foreground p-2 rounded-md h-10 w-10 flex items-center justify-center">
          <Send class="h-4 w-4" />
        </button>
      </div>
      <div class="flex justify-start space-x-1">
        <button class="btn-outline-sm"><ImageIcon :size="16" class="mr-1"/>图片</button>
        <button class="btn-outline-sm"><Paperclip :size="16" class="mr-1"/>文档</button>
        <button class="btn-outline-sm"><Mic :size="16" class="mr-1"/>语音</button>
        <button class="btn-outline-sm"><VideoIcon :size="16" class="mr-1"/>视频</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Send, ImageIcon, Paperclip, Mic, Video as VideoIcon } from 'lucide-vue-next';
</script>
<style scoped>
.btn-outline-sm {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs h-8 px-2 rounded-md flex items-center;
}
</style>
