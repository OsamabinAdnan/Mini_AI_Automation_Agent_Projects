'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  preview: string;
  onRemoveBackground: () => void;
  onCancel: () => void;
}

export default function ImagePreview({
  file,
  preview,
  onRemoveBackground,
  onCancel,
}: ImagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="border rounded-xl p-6 relative"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors z-10"
          style={{
            background: 'var(--surface-hover)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-hover)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Cancel and remove image"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          {/* Image preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="text-xs mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Original
              </p>
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                  style={{ background: 'var(--bg)' }}
                />
              </div>
            </div>
            <div>
              <p
                className="text-xs mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Result
              </p>
              <div
                className="rounded-lg aspect-square flex items-center justify-center"
                style={{ background: 'var(--bg)' }}
              >
                <p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Preview
                </p>
              </div>
            </div>
          </div>

          {/* File info */}
          <div
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>

          {/* Action button */}
          <button
            onClick={onRemoveBackground}
            className="w-full px-6 py-3 rounded-lg text-sm font-medium transition-all pulse-glow"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
            }}
          >
            Remove Background
          </button>
        </div>
      </div>
    </motion.div>
  );
}
