
'use client';
import React, { useState, useRef, useEffect, createContext, useContext, type ReactNode, type HTMLAttributes } from 'react';
import { ChevronRight } from 'lucide-react';

// Context to manage dropdown state
interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
}
const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('useDropdownMenu must be used within a DropdownMenuProvider');
  }
  return context;
};

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}
export function DropdownMenuTrigger({ children, className, onClick, ...props }: DropdownMenuTriggerProps) {
  const { setIsOpen, triggerRef } = useDropdownMenu();
  return (
    <button
      ref={triggerRef}
      type="button"
      className={className}
      onClick={(e) => {
        setIsOpen(prev => !prev);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'end';
  sideOffset?: number;
}
export function DropdownMenuContent({ children, className, align = 'start', sideOffset = 4, ...props }: DropdownMenuContentProps) {
  const { isOpen, setIsOpen, triggerRef } = useDropdownMenu();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isOpen) return null;

  const alignmentClass = align === 'end' ? 'right-0' : 'left-0';

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md mt-1 ${alignmentClass} ${className || ''}`}
      style={{ marginTop: `${sideOffset}px` }}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onSelect?: () => void; // For consistency with Radix
  disabled?: boolean;
}
export function DropdownMenuItem({ children, className, onClick, onSelect, disabled, ...props }: DropdownMenuItemProps) {
   const { setIsOpen } = useDropdownMenu();
  return (
    <div
      className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'} ${className || ''}`}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        onSelect?.();
        setIsOpen(false);
      }}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={`-mx-1 my-1 h-px bg-muted ${className || ''}`} {...props} />;
}

// Basic stubs for other parts if needed for API completeness
export function DropdownMenuGroup({ children }: { children: ReactNode }) { return <>{children}</>; }
export function DropdownMenuSub({ children }: { children: ReactNode }) { return <div className="relative">{children}</div>; }

interface DropdownMenuSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export function DropdownMenuSubTrigger({ children, className, ...props }: DropdownMenuSubTriggerProps) {
  return (
    <div className={`flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent ${className || ''}`} {...props}>
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  );
}

interface DropdownMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export function DropdownMenuSubContent({ children, className, ...props }: DropdownMenuSubContentProps) {
  // Basic positioning, would need more complex logic for perfect Radix-like behavior
  return (
    <div className={`absolute left-full top-0 z-50 min-w-[8rem] ml-1 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuCheckboxItem({ children }: {children: ReactNode}) { return <div>{children} (Checkbox Item)</div>; }
export function DropdownMenuRadioGroup({ children }: {children: ReactNode}) { return <div>{children}</div>; }
export function DropdownMenuRadioItem({ children }: {children: ReactNode}) { return <div>{children} (Radio Item)</div>; }
export function DropdownMenuLabel({ children }: {children: ReactNode}) { return <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>; }
export function DropdownMenuShortcut({ children }: {children: ReactNode}) { return <span className="ml-auto text-xs tracking-widest opacity-60">{children}</span>; }
