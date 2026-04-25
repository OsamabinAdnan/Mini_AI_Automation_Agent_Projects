'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Zap, Sparkles, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProviderId = 'cohere' | 'openrouter' | 'gemini';

interface Provider {
  id: ProviderId;
  name: string;
  description: string;
  avg_latency_ms: number;
}

const providers: Provider[] = [
  { id: 'cohere', name: 'Cohere', description: 'command-a-03-2025', avg_latency_ms: 2000 },
  { id: 'openrouter', name: 'OpenRouter', description: 'google/gemma-3-4b-it:free', avg_latency_ms: 1500 },
  { id: 'gemini', name: 'Gemini', description: 'gemma-4-26b-a4b-it', avg_latency_ms: 800 },
];

const providerIcons: Record<ProviderId, React.ComponentType<{ className?: string }>> = {
  cohere: Sparkles,
  openrouter: Zap,
  gemini: Scale,
};

export function ProviderSelector({
  value,
  onChange
}: {
  value: ProviderId;
  onChange: (provider: ProviderId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {providers.map((provider) => {
        const ProviderIcon = providerIcons[provider.id];
        const selected = value === provider.id;

        return (
          <button
            key={provider.id}
            onClick={() => onChange(provider.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] border-2 transition-all duration-300 relative overflow-hidden group ${
              selected
                ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 shadow-[0_0_15px_var(--neon-cyan-glow)]'
                : 'border-[var(--border-primary)] text-[var(--foreground-muted)] hover:border-[var(--neon-purple)] hover:text-[var(--neon-purple)] hover:shadow-[0_0_10px_var(--neon-purple-glow)]'
            }`}
          >
            <ProviderIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${selected ? 'text-[var(--neon-cyan)]' : 'text-[var(--foreground-muted)] group-hover:text-[var(--neon-purple)]'}`} />
            <span className="truncate">{provider.name}</span>
          </button>
        );
      })}
    </div>
  );
}
