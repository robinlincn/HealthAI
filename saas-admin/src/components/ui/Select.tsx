
import type { ReactNode, SelectHTMLAttributes, OptionHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <select
        className="appearance-none flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  );
}

// These are simplified to work with the native select.
// ShadCN's Select uses Radix UI for a custom dropdown experience.

export function SelectTrigger({ children, className }: { children: ReactNode, className?: string }) {
  // This component is more of a conceptual placeholder when using native select.
  // The actual trigger is the <select> element itself.
  // For API consistency, it can wrap children, but won't render a separate trigger.
  return <div className={className}>{children}</div>; // Or simply return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  // This is also conceptual for native select. The selected value is displayed by the select itself.
  // It could render the placeholder if nothing is selected, but native select handles this.
  return null; // Or <span className="text-muted-foreground">{placeholder}</span> if used carefully.
}

export function SelectContent({ children, className }: { children: ReactNode, className?: string }) {
  // The content (options) are direct children of the <select> element.
  // This component is for API consistency.
  return <>{children}</>; // Or a div wrapper if specific styling for the option group is needed.
}

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
