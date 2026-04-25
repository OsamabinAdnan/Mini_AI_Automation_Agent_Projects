import { CyberButton } from "@/components/ui/CyberButton";
import Link from "next/link";
import { Zap, Terminal, Sparkles, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-5 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-pink)] opacity-5 blur-[120px] animate-pulse delay-1000"></div>

      <main className="relative z-10 flex flex-col items-center gap-6 sm:gap-10 text-center px-4 py-16 sm:py-0 max-w-4xl mx-auto mt-16 sm:mt-0">
        {/* Logo Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--neon-cyan)] opacity-20 blur-2xl animate-pulse"></div>
          <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--neon-cyan)] drop-shadow-[0_0_20px_var(--neon-cyan)]" />
        </div>

        {/* Main Heading */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="cyber-heading-xl text-3xl sm:text-5xl md:text-6xl relative break-words px-2">
            <span className="relative z-10">AI PROPOSAL WRITER</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-pink)] to-[var(--neon-purple)] bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm">
              AI PROPOSAL WRITER
            </div>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[var(--foreground-muted)] font-mono text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--neon-green)] rounded-full animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
            <span className="w-px h-3 sm:h-4 bg-[var(--border-primary)]"></span>
            <span>V2.0</span>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-xl text-[var(--foreground-secondary)] font-mono text-xs sm:text-base leading-relaxed px-2">
          Generate high-converting freelance proposals with AI-powered precision.
          <br className="hidden sm:block" />
          <span className="text-[var(--neon-cyan)]">Cyberpunk-themed</span> for the modern developer.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl px-2">
          <div className="cyber-card p-3 sm:p-4 group hover:border-[var(--neon-cyan)] transition-all duration-300">
            <Terminal className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--neon-cyan)] mx-auto mb-2 sm:mb-3 group-hover:drop-shadow-[0_0_8px_var(--neon-cyan)] transition-all" />
            <h3 className="cyber-text-muted text-[10px] sm:text-xs mb-2">AI POWERED</h3>
            <p className="text-[var(--foreground-muted)] text-[10px] sm:text-xs">Multi-provider LLM integration</p>
          </div>
          <div className="cyber-card p-3 sm:p-4 group hover:border-[var(--neon-pink)] transition-all duration-300">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--neon-pink)] mx-auto mb-2 sm:mb-3 group-hover:drop-shadow-[0_0_8px_var(--neon-pink)] transition-all" />
            <h3 className="cyber-text-muted text-[10px] sm:text-xs mb-2">INSTANT GENERATION</h3>
            <p className="text-[var(--foreground-muted)] text-[10px] sm:text-xs">Real-time proposal creation</p>
          </div>
          <div className="cyber-card p-3 sm:p-4 group hover:border-[var(--neon-purple)] transition-all duration-300">
            <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--neon-purple)] mx-auto mb-2 sm:mb-3 group-hover:drop-shadow-[0_0_8px_var(--neon-purple)] transition-all" />
            <h3 className="cyber-text-muted text-[10px] sm:text-xs mb-2">SECURE & PRIVATE</h3>
            <p className="text-[var(--foreground-muted)] text-[10px] sm:text-xs">End-to-end encrypted</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto px-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <CyberButton
              variant="primary"
              size="lg"
              className="min-w-[200px] w-full sm:w-auto py-2.5 sm:py-3 text-xs sm:text-sm hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.98] active:shadow-[0_0_12px_var(--neon-cyan-glow)]"
            >
              LAUNCH APP
            </CyberButton>
          </Link>
          <Link href="/features" className="w-full sm:w-auto">
            <CyberButton
              variant="secondary"
              size="lg"
              className="min-w-[200px] w-full sm:w-auto py-2.5 sm:py-3 text-xs sm:text-sm hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.98] active:shadow-[0_0_12px_var(--neon-pink-glow)]"
            >
              LEARN MORE
            </CyberButton>
          </Link>
        </div>
      </main>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-30"></div>
    </div>
  );
}

