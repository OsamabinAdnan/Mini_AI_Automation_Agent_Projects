import { Check, Zap, Crown, Rocket } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: "STARTER",
      price: "$0",
      period: "/ mo",
      icon: Zap,
      description: "Perfect for getting started",
      color: "cyan",
      features: [
        "5 proposals per day",
        "Community LLM providers",
        "Basic tone customization",
        "Proposal history (7 days)",
        "Email support"
      ],
      cta: "GET STARTED",
      highlighted: false
    },
    {
      name: "PROFESSIONAL",
      price: "Coming",
      period: "Soon",
      icon: Crown,
      description: "For serious freelancers",
      color: "pink",
      features: [
        "Unlimited proposals",
        "All LLM providers (Gemini, Cohere, OpenRouter)",
        "Advanced tone customization",
        "Unlimited proposal history",
        "Priority support",
        "Custom branding",
        "API access"
      ],
      cta: "UPGRADE NOW",
      highlighted: true
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      period: "pricing",
      icon: Rocket,
      description: "For teams & agencies",
      color: "purple",
      features: [
        "Everything in Professional",
        "Team collaboration",
        "Advanced analytics",
        "Custom AI models",
        "Dedicated support",
        "SLA guarantee",
        "On-premise deployment"
      ],
      cta: "CONTACT SALES",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 pb-8 sm:pb-16 px-4">
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      {/* Glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-cyan)] opacity-5 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--neon-pink)] opacity-5 blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <div className="inline-flex items-center gap-2 mb-4 px-3 sm:px-4 py-2 border-2 border-[var(--border-primary)] bg-[var(--background-glass)] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-pink)] animate-pulse shadow-[0_0_8px_var(--neon-pink)]"></div>
            <span className="cyber-text-muted text-[8px] sm:text-[10px]">PRICING PLANS</span>
          </div>
          <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 break-words">
            PRICING.config
          </h1>
          <p className="cyber-text-secondary text-xs sm:text-sm max-w-2xl mx-auto break-words">
            Choose the perfect plan for your freelancing journey. Scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const colorMap = {
              cyan: 'var(--neon-cyan)',
              pink: 'var(--neon-pink)',
              purple: 'var(--neon-purple)'
            };
            const color = colorMap[tier.color as keyof typeof colorMap];

            return (
              <div
                key={index}
                className={`relative group transition-all duration-300 ${
                  tier.highlighted ? 'md:scale-105' : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-cyan)] blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
                )}
                <div
                  className={`cyber-card relative h-full flex flex-col ${
                    tier.highlighted
                      ? 'border-[var(--neon-pink)] shadow-[0_0_30px_var(--neon-pink-glow)]'
                      : 'hover:border-[var(--neon-cyan)] transition-all duration-300'
                  }`}
                  style={
                    tier.highlighted
                      ? {}
                      : {
                          borderColor: color,
                          borderWidth: '2px'
                        }
                  }
                >
                  {/* Tier Badge */}
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-[var(--neon-pink)] text-[var(--background)] text-[8px] sm:text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b-2 border-[var(--border-primary)] pb-3">
                    <div
                      className="p-1.5 sm:p-2 border-2"
                      style={{
                        borderColor: color,
                        background: `${color}10`
                      }}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        style={{
                          color: color,
                          filter: `drop-shadow(0 0 8px ${color})`
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="cyber-heading-sm text-xs sm:text-sm break-words"
                        style={{ color: color }}
                      >
                        {tier.name}
                      </h3>
                      <p className="cyber-text-muted text-[8px] sm:text-[9px] break-words">{tier.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1">
                      <span
                        className="cyber-heading-lg text-xl sm:text-3xl break-words"
                        style={{ color: color }}
                      >
                        {tier.price}
                      </span>
                      <span className="cyber-text-secondary text-[10px] sm:text-xs">{tier.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check
                          className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0"
                          style={{ color: color }}
                        />
                        <span className="cyber-text-secondary text-[10px] sm:text-xs leading-relaxed break-words">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2 sm:py-3 px-3 sm:px-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] border-2 transition-all duration-300 relative overflow-hidden group/btn ${
                      tier.highlighted
                        ? 'cyber-button-secondary border-[var(--neon-pink)] text-[var(--neon-pink)] hover:shadow-[0_0_20px_var(--neon-pink-glow)]'
                        : 'cyber-button-primary border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:shadow-[0_0_20px_var(--neon-cyan-glow)]'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="cyber-card border-[var(--neon-cyan)] max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[var(--border-primary)] pb-3">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-cyan)]" />
            <h2 className="cyber-heading-sm text-xs sm:text-base">FREQUENTLY ASKED</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="cyber-text-muted text-xs sm:text-sm mb-2 text-[var(--neon-cyan)] break-words">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="cyber-text-secondary text-[10px] sm:text-xs leading-relaxed break-words">
                Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.
              </p>
            </div>

            <div>
              <h3 className="cyber-text-muted text-xs sm:text-sm mb-2 text-[var(--neon-pink)] break-words">
                What payment methods do you accept?
              </h3>
              <p className="cyber-text-secondary text-[10px] sm:text-xs leading-relaxed break-words">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </p>
            </div>

            <div>
              <h3 className="cyber-text-muted text-xs sm:text-sm mb-2 text-[var(--neon-purple)] break-words">
                Is there a free trial?
              </h3>
              <p className="cyber-text-secondary text-[10px] sm:text-xs leading-relaxed break-words">
                The Starter plan is completely free with no credit card required. Upgrade to Professional anytime to unlock advanced features.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center px-2">
          <div className="cyber-card max-w-2xl mx-auto border-[var(--neon-purple)]">
            <h3 className="cyber-heading-md text-lg sm:text-xl mb-4 break-words" style={{ color: 'var(--neon-purple)' }}>
              Ready to Level Up?
            </h3>
            <p className="cyber-text-secondary text-xs sm:text-sm mb-4 sm:mb-6 break-words">
              Start with our free plan and upgrade whenever you're ready. No commitment required.
            </p>
            <a href="/signup">
              <button className="cyber-button-primary py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto">
                START FREE
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}