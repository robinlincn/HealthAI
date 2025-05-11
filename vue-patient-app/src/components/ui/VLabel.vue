<template>
  <label :for="forInput" :class="labelClasses">
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  forInput: {
    type: String as PropType<string>,
    default: '',
  },
  class: {
    type: String as PropType<string>,
    default: '',
  }
});

const baseStyles = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

const labelClasses = computed(() => [
    baseStyles,
    props.class
].join(' '));

</script>
