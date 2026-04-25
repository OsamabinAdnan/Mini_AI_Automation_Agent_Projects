import { Code, Cpu, Rocket, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "AI Models", value: "3+", icon: Cpu },
    { label: "Proposals Generated", value: "10K+", icon: Zap },
    { label: "Active Users", value: "500+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 pb-8 sm:pb-16 px-4">
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      {/* Glowing orbs */}
      <div className="fixed top-1/3 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-purple)] opacity-5 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/3 right-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-cyan)] opacity-5 blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <div className="inline-flex items-center gap-2 mb-4 px-3 sm:px-4 py-2 border-2 border-[var(--border-primary)] bg-[var(--background-glass)] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-purple)] animate-pulse shadow-[0_0_8px_var(--neon-purple)]"></div>
            <span className="cyber-text-muted text-[8px] sm:text-[10px]">ABOUT THE PROJECT</span>
          </div>
          <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 break-words">
            ABOUT_US.md
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left Column - Story */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b-2 border-[var(--border-primary)] pb-3">
              <Code className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--neon-cyan)]" />
              <h2 className="cyber-heading-sm text-sm sm:text-base">OUR MISSION</h2>
            </div>
            <div className="space-y-3 sm:space-y-4 cyber-text-secondary text-xs sm:text-sm leading-relaxed">
              <p>
                AI Proposal Writer is an immersive, high-performance tool built to help freelancers
                master the bidding process. In a fast-paced gig economy, speed and quality are paramount.
              </p>
              <p>
                We leverage advanced AI Agent SDKs and a curated selection of LLM providers to ensure
                you spend less time drafting and more time executing on projects that matter.
              </p>
              <p className="text-[var(--neon-cyan)] font-medium">
                Built for the future of work.
              </p>
            </div>
          </div>

          {/* Right Column - Tech Stack */}
          <div className="cyber-card border-[var(--neon-purple)]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b-2 border-[var(--border-primary)] pb-3">
              <Rocket className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--neon-purple)]" />
              <h2 className="cyber-heading-sm text-sm sm:text-base">TECH STACK</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Next.js 15", desc: "React framework with App Router" },
                { name: "FastAPI", desc: "High-performance Python backend" },
                { name: "Supabase", desc: "PostgreSQL database & auth" },
                { name: "Tailwind CSS v4", desc: "Modern utility-first CSS" },
                { name: "OpenAI Agent SDK", desc: "AI agent orchestration" },
                { name: "Framer Motion", desc: "Smooth animations" }
              ].map((tech, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border-2 border-[var(--border-primary)] hover:border-[var(--neon-purple)] transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--neon-purple)] mt-1 sm:mt-1.5 shadow-[0_0_8px_var(--neon-purple)] flex-shrink-0"></div>
                  <div className="min-w-0">
                    <h3 className="cyber-text-muted text-[8px] sm:text-[10px] text-[var(--neon-purple)] break-words">{tech.name}</h3>
                    <p className="cyber-text-secondary text-[10px] sm:text-xs break-words">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="cyber-card border-[var(--neon-cyan)] mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[var(--border-primary)] pb-3">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--neon-cyan)]" />
            <h2 className="cyber-heading-sm text-sm sm:text-base">PLATFORM STATS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--neon-cyan)] mx-auto mb-2 sm:mb-3 drop-shadow-[0_0_8px_var(--neon-cyan)]" />
                  <div className="cyber-heading-lg text-xl sm:text-2xl mb-1 sm:mb-2 break-words">{stat.value}</div>
                  <div className="cyber-text-muted text-[8px] sm:text-[10px] break-words">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center px-2">
          <div className="cyber-card max-w-2xl mx-auto border-[var(--neon-pink)]">
            <h3 className="cyber-heading-md text-lg sm:text-xl md:text-2xl mb-4 break-words" style={{ color: 'var(--neon-pink)' }}>
              Join the Revolution
            </h3>
            <p className="cyber-text-secondary text-xs sm:text-sm mb-4 sm:mb-6 break-words">
              Start generating winning proposals today with our AI-powered platform.
            </p>
            <a href="/signup">
              <button className="cyber-button-secondary py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto">
                GET STARTED
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}