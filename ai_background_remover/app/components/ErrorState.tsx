'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border rounded-xl p-8"
        style={{
          borderColor: 'var(--error)',
          background: 'var(--surface)',
        }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle size={48} style={{ color: 'var(--error)' }} />
          <div>
            <h3
              className="text-base font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Something went wrong
            </h3>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-lg text-sm font-medium border transition-colors mt-2"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
