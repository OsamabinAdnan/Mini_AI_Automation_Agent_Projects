'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ScanningLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        y: '100%',
        duration: 3,
        repeat: -1,
        ease: "none"
      });
    }
  });
  
  return (
    <div 
      ref={lineRef}
      className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-[#00FFE0]/20 to-transparent pointer-events-none"
      style={{ y: '-100%' }}
    />
  );
}
