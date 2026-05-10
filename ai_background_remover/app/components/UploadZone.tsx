'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { validateFile } from '@/lib/validations';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? 'var(--border-active)' : 'var(--border)',
          background: isDragging ? 'var(--surface-hover)' : 'var(--surface)',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          <Upload
            size={40}
            style={{ color: 'var(--text-secondary)' }}
          />
          <div>
            <p
              className="text-base mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Drop your image here
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              or click to browse
            </p>
          </div>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            PNG · JPG · WEBP · up to 25MB
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 text-sm text-center"
          style={{ color: 'var(--error)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
