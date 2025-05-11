import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* This layout ensures content is centered. Specific pages like login can add their own full-screen backgrounds. */}
      {children}
    </div>
  );
}
