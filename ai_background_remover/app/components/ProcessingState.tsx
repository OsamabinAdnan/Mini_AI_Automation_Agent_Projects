'use client';

export default function ProcessingState() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border rounded-xl p-8"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div className="space-y-6">
          {/* Shimmer skeleton for images */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="text-xs mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Original
              </p>
              <div
                className="shimmer rounded-lg aspect-square"
                style={{ background: 'var(--bg)' }}
              />
            </div>
            <div>
              <p
                className="text-xs mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Result
              </p>
              <div
                className="shimmer rounded-lg aspect-square"
                style={{ background: 'var(--bg)' }}
              />
            </div>
          </div>

          {/* Processing text with blinking cursor */}
          <div className="text-center">
            <p
              className="text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Removing background
              <span className="blink">_</span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" />
        </div>
      </div>
    </div>
  );
}
