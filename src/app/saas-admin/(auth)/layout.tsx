
import type { ReactNode } from 'react';

export default function SaasAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      {children}
    </div>
  );
}
