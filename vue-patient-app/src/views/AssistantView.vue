<template>
  <div class="p-4 h-full flex flex-col">
    <!-- <h1 class="text-xl font-semibold mb-4">AI小助手</h1> -->
    <div class="bg-card p-6 rounded-lg shadow-md text-center flex-grow flex flex-col justify-center">
      <MessageSquare class="w-16 h-16 text-primary/50 mx-auto mb-4" /> <!-- Using MessageSquare as placeholder for Bot -->
      <p class="text-muted-foreground">AI健康助手功能正在建设中。</p>
      <p class="text-sm mt-2">您将能够在此与AI助手对话，获取健康建议和解答疑问。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using MessageSquare as a placeholder for Bot icon, as Bot icon might not be directly available or named the same in lucide-vue-next.
// If a specific 'Bot' icon exists, it should be used. For now, MessageSquare is a reasonable alternative for chat/assistant.
import { MessageSquare } from 'lucide-vue-next';
</script>
