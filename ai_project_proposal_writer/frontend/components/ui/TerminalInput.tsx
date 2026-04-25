'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TerminalInput({
  value,
  onChange,
  className = '',
  placeholder = '',
  disabled = false
}: TerminalInputProps) {
  return (
    <div className="relative group">
      {/* Neon border effect container */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-30 group-focus-within:opacity-100 transition duration-300 blur-sm rounded-lg" />

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "relative bg-[#0A0A0F] border-2 border-neon-purple/50 text-neon-cyan placeholder:text-neon-cyan/50 font-mono resize-none focus:border-neon-cyan focus:ring-0 rounded-lg",
          className
        )}
      />
      
      {/* Decorative prompt indicator */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <span className="text-neon-cyan font-mono animate-pulse">_</span>
      </div>
    </div>
  );
}
