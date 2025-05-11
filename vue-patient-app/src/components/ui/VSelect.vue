<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :class="selectClasses"
    :required="required"
    :disabled="disabled"
  >
    <slot></slot> <!-- For <option> elements -->
  </select>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: '',
  },
  required: Boolean,
  disabled: Boolean,
  class: {
      type: String,
      default: ''
  }
});

defineEmits(['update:modelValue']);

const baseStyles = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const selectClasses = computed(() => [
    baseStyles,
    props.class
].join(' '));
</script>
