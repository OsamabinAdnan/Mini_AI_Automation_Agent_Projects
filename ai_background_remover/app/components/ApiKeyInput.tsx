'use client';

import { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, X, AlertCircle, Loader2, Info } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '@/lib/utils';
import { validateApiKey } from '@/lib/validations';
import { REMOVE_BG_SIGNUP_URL } from '@/lib/constants';
import type { ApiKeyStatus } from '@/types';

interface ApiKeyInputProps {
  onKeyValidated: (isValid: boolean) => void;
}

export default function ApiKeyInput({ onKeyValidated }: ApiKeyInputProps) {
  const [apiKey, setApiKeyState] = useState('');
  const [status, setStatus] = useState<ApiKeyStatus>({
    isValid: false,
    isTested: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyState(savedKey);
      setStatus({ isValid: true, isTested: true });
      onKeyValidated(true);
    }
  }, [onKeyValidated]);

  const handleTestKey = async () => {
    if (!validateApiKey(apiKey)) {
      setStatus({
        isValid: false,
        isTested: true,
        error: 'Invalid API key format',
      });
      onKeyValidated(false);
      return;
    }

    setIsTesting(true);

    try {
      // Test the API key with a small request
      const response = await fetch('https://api.remove.bg/v1.0/account', {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(apiKey);
        setStatus({
          isValid: true,
          isTested: true,
          credits: data.data?.attributes?.credits || undefined
        });
        setIsEditing(false);
        onKeyValidated(true);
      } else {
        setStatus({
          isValid: false,
          isTested: true,
          error: 'Invalid API key. Please check and try again.',
        });
        onKeyValidated(false);
      }
    } catch (error) {
      setStatus({
        isValid: false,
        isTested: true,
        error: 'Failed to verify API key. Please try again.',
      });
      onKeyValidated(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = () => {
    handleTestKey();
  };

  const handleClearKey = () => {
    clearApiKey();
    setApiKeyState('');
    setStatus({ isValid: false, isTested: false });
    setIsEditing(true);
    onKeyValidated(false);
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 4)}${'*'.repeat(apiKey.length - 8)}${apiKey.slice(-4)}`
    : '';

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className="border rounded-xl p-6"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Key size={20} style={{ color: 'var(--text-secondary)' }} />
          <h2
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            API Key Configuration
          </h2>
        </div>

        {/* Info box about API key benefits */}
        <div
          className="mb-4 p-4 rounded-lg border"
          style={{
            background: 'var(--bg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-start gap-2">
            <Info size={16} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
            <div className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Why use your own API key?
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>No rate limits - use your own quota (50 free images/month)</li>
                <li>Complete privacy - your key stays in your browser</li>
                <li>No costs for us - you control your usage</li>
                <li>Upgrade anytime at remove.bg for more credits</li>
              </ul>
            </div>
          </div>
        </div>

        {!status.isValid || isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="Paste your remove.bg API key"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm"
              style={{
                background: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-hover)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
              }}
            />

            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Don't have one?</span>
              <a
                href={REMOVE_BG_SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                Get your free API key here
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Sign up at remove.bg → Dashboard → Copy API key → Paste here
            </div>

            {status.error && (
              <div
                className="flex items-center gap-2 text-xs p-3 rounded-lg"
                style={{ background: 'var(--bg)', color: 'var(--error)' }}
              >
                <AlertCircle size={14} />
                {status.error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim() || isTesting}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                }}
              >
                {isTesting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Save & Test Key'
                )}
              </button>
              {status.isValid && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'var(--bg)' }}
            >
              <div className="flex items-center gap-2">
                <Check size={16} style={{ color: 'var(--success)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {maskedKey}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs px-3 py-1 rounded border transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Change
                </button>
                <button
                  onClick={handleClearKey}
                  className="text-xs px-3 py-1 rounded border transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--error)',
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: 'var(--success)' }}
            >
              <Check size={14} />
              <span>API key verified and active</span>
              {status.credits !== undefined && (
                <span style={{ color: 'var(--text-secondary)' }}>
                  • {status.credits.total - status.credits.used} credits remaining
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
