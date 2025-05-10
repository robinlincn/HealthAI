
// Placeholder for a more complex logo SVG
import type { SVGProps } from 'react';

export function HospitalLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Simplified Lotus-like shape */}
      <path d="M50 30 Q55 10 60 30 T70 30" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
      <path d="M45 35 Q55 20 65 35 T85 35" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M40 40 Q55 25 70 40 T100 40" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4"/>
      
      {/* Text Placeholder */}
      <text x="75" y="28" fontFamily="Arial, sans-serif" fontSize="14" fill="hsl(var(--foreground))" fontWeight="bold">长沙自贸医院</text>
      <text x="75" y="45" fontFamily="Arial, sans-serif" fontSize="8" fill="hsl(var(--muted-foreground))">CHANGSHA FREE TRADE HOSPITAL</text>
    </svg>
  );
}
