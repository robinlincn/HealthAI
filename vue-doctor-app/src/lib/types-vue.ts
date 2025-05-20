import type { Component } from 'vue';

export interface NavItemVue {
  title: string;
  href: string;
  icon: Component;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  children?: NavItemVue[];
}

// Add other Doctor specific types here as needed, mirroring from src/lib/types.ts
// For example:
// export interface DoctorProfileVue { ... }
// export interface DoctorAppointmentVue { ... }
