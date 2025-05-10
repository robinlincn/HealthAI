
import type { SVGProps } from 'react';

export function DeviceMockups(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Monitor */}
      <rect x="70" y="30" width="160" height="100" rx="5" ry="5" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2"/>
      <rect x="75" y="35" width="150" height="85" fill="white"/>
      <rect x="130" y="130" width="40" height="20" fill="#BDBDBD"/>
      <circle cx="150" cy="125" r="3" fill="#757575"/>
      
      {/* Laptop */}
      <rect x="20" y="80" width="120" height="70" rx="5" ry="5" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2" transform="skewX(-5)"/>
      <rect x="25" y="85" width="110" height="55" fill="white" transform="skewX(-5)"/>
      <rect x="15" y="150" width="130" height="10" rx="3" ry="3" fill="#BDBDBD" transform="skewX(-5)"/>
      <circle cx="30" cy="90" r="2" fill="#757575" transform="skewX(-5)"/>

      {/* Tablet */}
      <rect x="200" y="70" width="70" height="100" rx="5" ry="5" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2"/>
      <rect x="205" y="75" width="60" height="85" fill="white"/>
      <circle cx="235" cy="160" r="3" fill="#757575"/>
      
      {/* Phone */}
      <rect x="240" y="110" width="40" height="70" rx="3" ry="3" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="1.5"/>
      <rect x="243" y="113" width="34" height="59" fill="white"/>
      <circle cx="250" cy="116" r="1" fill="#757575"/>
    </svg>
  );
}
