
import React, { type ReactNode, type SelectHTMLAttributes, type OptionHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this path is correct for saas-admin's utils

interface SelectPropsOriginal extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectPropsOriginal>(
  ({ children, className, ...props }, ref) => {
    return (
      // The div wrapper is for styling the chevron, the ref goes to the select itself.
      <div className={cn('relative w-full', className)}>
        <select
          ref={ref}
          className="appearance-none flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";


interface SelectItemProps extends OptionHTMLAttributes<HTMLOptionElement> {
  children: ReactNode;
  value: string;
}
export function SelectItem({ children, value, className, ...props }: SelectItemProps) {
  return (
    <option value={value} className={className} {...props}>
      {children}
    </option>
  );
}

// These are conceptual stubs for API consistency if used elsewhere for display purposes,
// but not for react-hook-form control in this native setup.
export function SelectTrigger({ children, className }: { children: ReactNode, className?: string }) {
  // This is a display-only component if not used as the actual form control target
  return <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm", className)}>{children}</div>;
}

export function SelectValue({ placeholder, children }: { placeholder?: string, children?: ReactNode }) {
  // In a native select, the browser handles displaying the selected value.
  // This could render placeholder if no value is selected, but usually handled by <select> itself or a label.
  // If children are provided, it means we might be trying to display the selected value manually.
  if (children) return <span className="text-sm">{children}</span>;
  if (placeholder) return <span className="text-sm text-muted-foreground">{placeholder}</span>;
  return null;
}

export function SelectContent({ children, className }: { children: ReactNode, className?: string }) {
  // Native <select> doesn't have a separate content wrapper like Radix.
  // This component would wrap <SelectItem> if used outside RHF, or just be a fragment.
  return <>{children}</>;
}

export { Select };
