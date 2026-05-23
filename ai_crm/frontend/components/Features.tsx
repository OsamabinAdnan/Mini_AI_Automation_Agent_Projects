export default function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Get intelligent summaries and next-action recommendations for every contact using advanced AI.",
    },
    {
      icon: "📊",
      title: "Smart Contact Management",
      description: "Organize contacts with tags, notes, and interaction history all in one place.",
    },
    {
      icon: "⚡",
      title: "Real-Time Sync",
      description: "Your data is always up-to-date across all devices with instant synchronization.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Enterprise-grade security with row-level access control and encrypted data storage.",
    },
    {
      icon: "📈",
      title: "Interaction Tracking",
      description: "Log every interaction and let AI analyze patterns to suggest optimal follow-ups.",
    },
    {
      icon: "🎯",
      title: "Action Recommendations",
      description: "Never miss a follow-up with AI-generated next actions based on your interaction history.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3 sm:mb-4">
            Powerful Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Everything you need to manage relationships and grow your network intelligently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
