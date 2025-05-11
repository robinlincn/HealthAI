import { defineComponent, h, type PropType } from 'vue';

const avatarBaseClass = "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full";
const avatarImageClass = "aspect-square h-full w-full";
const avatarFallbackClass = "flex h-full w-full items-center justify-center rounded-full bg-muted";

export const VAvatar = defineComponent({
  name: 'VAvatar',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('span', { class: [avatarBaseClass, props.class] }, slots.default && slots.default());
  }
});

export const VAvatarImage = defineComponent({
  name: 'VAvatarImage',
  props: {
    src: { type: String as PropType<string>, default: '' },
    alt: { type: String as PropType<string>, default: '' },
    class: { type: String as PropType<string>, default: '' },
    'data-ai-hint': { type: String, default: ''} // Accept data-ai-hint
  },
  setup(props) {
    return () => h('img', { 
        src: props.src, 
        alt: props.alt, 
        class: [avatarImageClass, props.class],
        'data-ai-hint': props['data-ai-hint'] || undefined
    });
  }
});

export const VAvatarFallback = defineComponent({
  name: 'VAvatarFallback',
  props: {
    class: { type: String as PropType<string>, default: '' }
  },
  setup(props, { slots }) {
    return () => h('span', { class: [avatarFallbackClass, props.class] }, slots.default && slots.default());
  }
});
