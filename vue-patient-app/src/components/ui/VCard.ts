import { defineComponent, h, type PropType } from 'vue';

const cardBaseClass = "rounded-lg border bg-card text-card-foreground shadow-sm";
const headerBaseClass = "flex flex-col space-y-1.5 p-6";
const titleBaseClass = "text-lg font-semibold leading-none tracking-tight"; // Adjusted from text-2xl for mobile
const descriptionBaseClass = "text-sm text-muted-foreground";
const contentBaseClass = "p-6 pt-0";
const footerBaseClass = "flex items-center p-6 pt-0";

export const VCard = defineComponent({
  name: 'VCard',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: [cardBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VCardHeader = defineComponent({
  name: 'VCardHeader',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: [headerBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VCardTitle = defineComponent({
  name: 'VCardTitle',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('h3', { class: [titleBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VCardDescription = defineComponent({
  name: 'VCardDescription',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('p', { class: [descriptionBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VCardContent = defineComponent({
  name: 'VCardContent',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: [contentBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VCardFooter = defineComponent({
  name: 'VCardFooter',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: [footerBaseClass, props.class] }, slots.default && slots.default());
  }
});
