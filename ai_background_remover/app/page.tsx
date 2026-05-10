'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import ApiKeyInput from './components/ApiKeyInput';
import UploadZone from './components/UploadZone';
import ImagePreview from './components/ImagePreview';
import ProcessingState from './components/ProcessingState';
import ImageComparison from './components/ImageComparison';
import ResultActions from './components/ResultActions';
import ErrorState from './components/ErrorState';
import ImageHistory from './components/ImageHistory';
import Footer from './components/Footer';
import { getApiKey } from '@/lib/utils';
import type { AppState, ProcessedImage } from '@/types';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ status: 'idle' });
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileSelect = (file: File) => {
    const preview = URL.createObjectURL(file);
    setAppState({ status: 'preview', file, preview });
  };

  const handleCancelPreview = () => {
    if (appState.status === 'preview') {
      URL.revokeObjectURL(appState.preview);
    }
    setAppState({ status: 'idle' });
  };

  const handleRemoveBackground = async () => {
    if (appState.status !== 'preview') return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setAppState({
        status: 'error',
        message: 'Please configure your API key first',
      });
      return;
    }

    setAppState({ status: 'processing' });

    try {
      const formData = new FormData();
      formData.append('image', appState.file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove background');
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);

      // Add to history
      const newImage: ProcessedImage = {
        id: Date.now().toString(),
        filename: appState.file.name,
        originalUrl: appState.preview,
        resultUrl: resultUrl,
        timestamp: Date.now(),
      };
      setProcessedImages((prev) => [newImage, ...prev]);

      setAppState({
        status: 'success',
        original: appState.preview,
        result: resultUrl,
        filename: appState.file.name,
      });
    } catch (error: any) {
      setAppState({
        status: 'error',
        message: error.message || 'An unexpected error occurred',
      });
    }
  };

  const handleRemoveAnother = () => {
    if (appState.status === 'success') {
      // Don't revoke URLs as they're stored in history
    }
    setAppState({ status: 'idle' });
  };

  const handleRetry = () => {
    setAppState({ status: 'idle' });
  };

  const handleSelectFromHistory = (image: ProcessedImage) => {
    setShowHistory(false);
    setAppState({
      status: 'success',
      original: image.originalUrl,
      result: image.resultUrl,
      filename: image.filename,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          {/* Scissors Logo */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'var(--text-primary)' }}
          >
            <path
              d="M6 7C7.10457 7 8 6.10457 8 5C8 3.89543 7.10457 3 6 3C4.89543 3 4 3.89543 4 5C4 6.10457 4.89543 7 6 7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 21C7.10457 21 8 20.1046 8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 4L8.5 15.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 8.5L20 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1
            className="text-base font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            ClearCut
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {mounted && processedImages.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <History size={16} />
              History ({processedImages.length})
            </button>
          )}
          <div
            className="text-sm flex items-center gap-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Powered by
            <span style={{ color: 'var(--text-primary)' }}>remove.bg</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Remove Backgrounds
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Drop an image. Get it back clean.
          </motion.p>
        </motion.div>

        {/* API Key Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full"
        >
          <ApiKeyInput onKeyValidated={setIsApiKeyValid} />
        </motion.div>

        {/* Main interactive area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          {appState.status === 'idle' && (
            <UploadZone
              onFileSelect={handleFileSelect}
              disabled={!isApiKeyValid}
            />
          )}

          {appState.status === 'preview' && (
            <ImagePreview
              file={appState.file}
              preview={appState.preview}
              onRemoveBackground={handleRemoveBackground}
              onCancel={handleCancelPreview}
            />
          )}

          {appState.status === 'processing' && <ProcessingState />}

          {appState.status === 'success' && (
            <>
              <ImageComparison
                original={appState.original}
                result={appState.result}
              />
              <ResultActions
                resultUrl={appState.result}
                filename={appState.filename}
                onRemoveAnother={handleRemoveAnother}
              />
            </>
          )}

          {appState.status === 'error' && (
            <ErrorState message={appState.message} onRetry={handleRetry} />
          )}
        </motion.div>
      </main>

      {/* History Modal */}
      {showHistory && (
        <ImageHistory
          images={processedImages}
          onClose={() => setShowHistory(false)}
          onSelectImage={handleSelectFromHistory}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
