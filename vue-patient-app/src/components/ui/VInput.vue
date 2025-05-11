<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :class="inputClasses"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :minlength="minlength"
    :min="min"
    :max="max"
  />
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  minlength: [String, Number],
  min: [String, Number],
  max: [String, Number],
  class: {
      type: String,
      default: ''
  }
});

defineEmits(['update:modelValue']);

const baseStyles = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const inputClasses = computed(() => [
    baseStyles,
    props.class
].join(' '));
</script>
