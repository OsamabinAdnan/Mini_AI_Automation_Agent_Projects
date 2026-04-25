'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
}

export function CyberButton({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
  type = 'button',
}: CyberButtonProps) {

  const baseClasses = "relative overflow-hidden font-mono font-semibold uppercase tracking-[0.15em] border-2 transition-all duration-300 group";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg"
  };

  const variantClasses = {
    primary: "border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-[var(--background)] hover:shadow-[0_0_30px_var(--neon-cyan-glow)]",
    secondary: "border-[var(--neon-pink)] text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-[var(--background)] hover:shadow-[0_0_30px_var(--neon-pink-glow)]",
    accent: "border-[var(--neon-purple)] text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-[var(--background)] hover:shadow-[0_0_30px_var(--neon-purple-glow)]",
    danger: "border-[var(--neon-red)] text-[var(--neon-red)] hover:bg-[var(--neon-red)] hover:text-[var(--background)] hover:shadow-[0_0_30px_var(--neon-red-glow)]",
    success: "border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--background)] hover:shadow-[0_0_30px_var(--neon-green-glow)]"
  };

  const glowColors = {
    primary: "var(--neon-cyan)",
    secondary: "var(--neon-pink)",
    accent: "var(--neon-purple)",
    danger: "var(--neon-red)",
    success: "var(--neon-green)"
  };

  return (
    <Button
      type={type}
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none",
        className
      )}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${glowColors[variant]}40 0%, transparent 70%)`
        }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="absolute top-0 left-0 w-full h-[2px] animate-pulse"
          style={{ background: `linear-gradient(90deg, transparent, ${glowColors[variant]}, transparent)` }}
        />
      </div>

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div
              className="w-4 h-4 border-2 border-current border-t-transparent animate-spin"
              style={{ borderColor: `${glowColors[variant]} transparent transparent transparent` }}
            />
            <span>PROCESSING...</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-60"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-60"></div>
    </Button>
  );
}