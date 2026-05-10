'use client';

import { History, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { ProcessedImage } from '@/types';
import { downloadBlob } from '@/lib/utils';

interface ImageHistoryProps {
  images: ProcessedImage[];
  onClose: () => void;
  onSelectImage: (image: ProcessedImage) => void;
}

export default function ImageHistory({ images, onClose, onSelectImage }: ImageHistoryProps) {
  const handleDownload = async (image: ProcessedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.resultUrl);
      const blob = await response.blob();
      // Remove original extension and force .png
      const nameWithoutExt = image.filename.replace(/\.[^/.]+$/, '');
      downloadBlob(blob, `removed-bg-${nameWithoutExt}.png`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[80vh] overflow-auto rounded-xl border"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 flex items-center justify-between p-4 border-b"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center gap-2">
              <History size={20} style={{ color: 'var(--text-secondary)' }} />
              <h2
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Session History ({images.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {images.length === 0 ? (
              <div
                className="text-center py-12"
                style={{ color: 'var(--text-muted)' }}
              >
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>No images processed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-lg overflow-hidden border cursor-pointer transition-all"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg)',
                    }}
                    onClick={() => onSelectImage(image)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <div className="aspect-square relative checkerboard">
                      <Image
                        src={image.resultUrl}
                        alt={image.filename}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2">
                      <p
                        className="text-xs truncate"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {image.filename}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {new Date(image.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Download button overlay */}
                    <button
                      onClick={(e) => handleDownload(image, e)}
                      className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Download size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
