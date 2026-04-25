'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimation() {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Neon glow pulse on hover
      document.querySelectorAll('.glow-on-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            boxShadow: '0 0 20px rgba(0, 255, 224, 0.6)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        
        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.in'
          });
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);
  
  return containerRef;
}
