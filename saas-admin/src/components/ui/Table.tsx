
import type { ReactNode, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export function Table({ children, className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`[&_tr]:border-b ${className || ''}`} {...props}>{children}</thead>;
}

export function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props}>{children}</tbody>;
}

export function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`} {...props}>{children}</tr>;
}

export function TableHead({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>{children}</th>;
}

export function TableCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>{children}</td>;
}

export function TableCaption({ children, className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
    return <caption className={`mt-4 text-sm text-muted-foreground ${className || ''}`} {...props}>{children}</caption>
}
