import { Terminal, Sparkles, Shield, Zap, Database, Clock } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Driven Analysis",
      description: "Instantly parse complex job descriptions to extract key skills and requirements with advanced NLP.",
      color: "cyan"
    },
    {
      icon: Zap,
      title: "Multi-Model Switching",
      description: "Seamlessly toggle between Gemini, Cohere, and OpenRouter to find the best output for your needs.",
      color: "pink"
    },
    {
      icon: Terminal,
      title: "Customizable Tones",
      description: "Generate proposals in Professional, Friendly, or Direct tones to match your client's style.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Integrated with Supabase Auth to track and manage your saved proposals with end-to-end encryption.",
      color: "cyan"
    },
    {
      icon: Database,
      title: "Proposal History",
      description: "Access your entire proposal history with favorites, search, and quick reload functionality.",
      color: "pink"
    },
    {
      icon: Clock,
      title: "Real-Time Generation",
      description: "Watch your proposals generate in real-time with our advanced streaming typewriter effect.",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 pb-8 sm:pb-16 px-4">
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      {/* Glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-cyan)] opacity-5 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-pink)] opacity-5 blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <div className="inline-flex items-center gap-2 mb-4 px-3 sm:px-4 py-2 border-2 border-[var(--border-primary)] bg-[var(--background-glass)] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse shadow-[0_0_8px_var(--neon-cyan)]"></div>
            <span className="cyber-text-muted text-[8px] sm:text-[10px]">SYSTEM FEATURES</span>
          </div>
          <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 break-words">
            CORE_FEATURES.sys
          </h1>
          <p className="cyber-text-secondary text-xs sm:text-sm max-w-2xl mx-auto break-words">
            Advanced AI-powered proposal generation with multi-model support,
            real-time streaming, and enterprise-grade security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorMap = {
              cyan: 'var(--neon-cyan)',
              pink: 'var(--neon-pink)',
              purple: 'var(--neon-purple)'
            };
            const color = colorMap[feature.color as keyof typeof colorMap];

            return (
              <div
                key={index}
                className="cyber-card group hover:border-[var(--neon-cyan)] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div
                    className="p-2 sm:p-3 border-2 transition-all duration-300 flex-shrink-0"
                    style={{
                      borderColor: color,
                      background: `${color}10`
                    }}
                  >
                    <Icon
                      className="w-5 sm:w-6 h-5 sm:h-6 transition-all duration-300"
                      style={{
                        color: color,
                        filter: `drop-shadow(0 0 8px ${color})`
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="cyber-heading-sm text-xs sm:text-sm mb-2 transition-all duration-300 break-words"
                      style={{ color: color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="cyber-text-secondary text-[10px] sm:text-xs leading-relaxed break-words">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center px-2">
          <div className="cyber-card max-w-2xl mx-auto border-[var(--neon-purple)]">
            <h3 className="cyber-heading-md text-lg sm:text-xl md:text-2xl mb-4 break-words" style={{ color: 'var(--neon-purple)' }}>
              Ready to Generate?
            </h3>
            <p className="cyber-text-secondary text-xs sm:text-sm mb-4 sm:mb-6 break-words">
              Start creating high-converting proposals in seconds with our AI-powered platform.
            </p>
            <a href="/dashboard">
              <button className="cyber-button-primary py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto">
                LAUNCH DASHBOARD
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}