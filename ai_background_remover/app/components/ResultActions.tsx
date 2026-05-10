'use client';

import { Download, RotateCcw } from 'lucide-react';
import { downloadBlob } from '@/lib/utils';

interface ResultActionsProps {
  resultUrl: string;
  filename: string;
  onRemoveAnother: () => void;
}

export default function ResultActions({
  resultUrl,
  filename,
  onRemoveAnother,
}: ResultActionsProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      // Remove original extension and force .png
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      const downloadFilename = `removed-bg-${nameWithoutExt}.png`;
      downloadBlob(blob, downloadFilename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all pulse-glow"
          style={{
            background: 'var(--accent)',
            color: 'var(--bg)',
          }}
        >
          <Download size={18} />
          Download PNG
        </button>

        <button
          onClick={onRemoveAnother}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-colors"
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
          <RotateCcw size={18} />
          Remove Another
        </button>
      </div>

      <div
        className="flex items-center justify-center gap-2 mt-4 text-xs"
        style={{ color: 'var(--success)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--success)' }}
        />
        Background removed successfully
      </div>
    </div>
  );
}
