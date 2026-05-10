'use client';

export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span>Made by</span>
        <a
          href="https://www.linkedin.com/in/osama-bin-adnan/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          Osama bin Adnan
        </a>
        <span>with</span>
        <svg
          className="heartbeat"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: '#ff4444' }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </footer>
  );
}
