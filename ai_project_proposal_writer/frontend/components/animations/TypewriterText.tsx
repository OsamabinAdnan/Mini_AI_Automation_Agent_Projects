'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className = '', speed = 15 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Reset on new text
    setDisplayedText('');
    indexRef.current = 0;
    lastTimeRef.current = 0;

    if (!text) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speed) {
        // Calculate how many chars to add based on elapsed time
        const charsToAdd = Math.max(1, Math.floor(elapsed / speed));
        const newIndex = Math.min(indexRef.current + charsToAdd, text.length);

        if (newIndex !== indexRef.current) {
          indexRef.current = newIndex;
          setDisplayedText(text.substring(0, newIndex));
        }
        lastTimeRef.current = timestamp;
      }

      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, speed]);

  return (
    <div className={`font-mono text-[#E0E0E0] whitespace-pre-wrap leading-relaxed text-sm sm:text-base ${className}`}>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-2 h-4 bg-[#00FFE0] ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
