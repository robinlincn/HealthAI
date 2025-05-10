import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface BentoGridItemProps {
  title: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  className?: string;
  cta?: string;
  children?: React.ReactNode;
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  href,
  icon: Icon,
  className,
  cta = "查看详情",
  children,
}: BentoGridItemProps) {
  return (
    <Card
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card border-border justify-between flex flex-col space-y-4",
        className
      )}
    >
      <Link href={href} className="flex flex-col h-full">
        <CardHeader className="p-2 pt-0 md:p-4">
          <div className="flex flex-row items-center space-x-2 mb-2">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
            <CardTitle className="text-lg font-medium group-hover/bento:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
          {description && (
            <CardDescription className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-2 pt-0 md:p-4 md:pt-0 flex-grow">
          {children}
        </CardContent>
        <div className="p-2 pt-0 md:p-4 md:pt-0 mt-auto">
            <span className="text-sm font-medium text-primary group-hover/bento:underline">
              {cta} &rarr;
            </span>
        </div>
      </Link>
    </Card>
  );
}
