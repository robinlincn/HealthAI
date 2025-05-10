import type { LucideProps } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <line x1="12" y1="22" x2="12" y2="17" />
      <line x1="20" y1="12" x2="20" y2="7" />
      <line x1="4" y1="12" x2="4" y2="7" />
      <circle cx="12" cy="12" r="3" fill="hsl(var(--primary))" stroke="none" opacity="0.5" />
    </svg>
  ),
  // Add other custom icons here if needed
};

export type Icon = keyof typeof Icons;
