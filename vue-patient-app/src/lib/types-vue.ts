import type { Component } from 'vue'; // For Lucide icons in Vue

export interface NavItemVue {
  title: string;
  href: string;
  icon: Component; // LucideIcon for Vue is a Vue component
  label?: string;
  disabled?: boolean;
  external?: boolean;
}

// Add other types as needed, mirroring src/lib/types.ts
// For example:
// export type Gender = "male" | "female" | "other";
// export interface UserProfileVue { ... }

// For now, only NavItemVue is defined to support navigation components.
