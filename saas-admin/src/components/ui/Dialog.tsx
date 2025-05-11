
'use client';
import type { ReactNode, HTMLAttributes } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={() => onOpenChange(false)} // Close on overlay click
    >
      <div 
        className="bg-background p-6 shadow-lg rounded-lg w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTrigger({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
  // This is a simple trigger. In ShadCN, it's often `asChild` with a Button.
  return <div onClick={onClick} className="cursor-pointer">{children}</div>;
}

export function DialogContent({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={`space-y-4 ${className || ''}`}>{children}</div>;
}

export function DialogHeader({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: ReactNode, className?: string }) {
  return <h2 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children: ReactNode, className?: string }) {
  return <p className={`text-sm text-muted-foreground ${className || ''}`}>{children}</p>;
}

export function DialogFooter({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 ${className || ''}`}>{children}</div>;
}

interface DialogCloseProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}
export function DialogClose({ children, className, onClick, ...props }: DialogCloseProps) {
  return (
    <button
      type="button"
      className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  );
}
