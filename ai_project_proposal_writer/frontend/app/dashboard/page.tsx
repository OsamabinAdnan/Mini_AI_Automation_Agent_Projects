'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CyberButton } from '@/components/ui/CyberButton';
import { TerminalInput } from '@/components/ui/TerminalInput';
import { ProviderSelector } from '@/components/ui/ProviderSelector';
import { TypewriterText } from '@/components/animations/TypewriterText';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserCircle, ChevronDown, ChevronUp, Sparkles, Copy, Download, RotateCcw, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { HistorySidebar } from '@/components/dashboard/HistorySidebar';

interface ProposalHistoryItem {
  id: string;
  generated_text: string;
  tone: string;
  model_used: string;
  created_at: string;
  job_descriptions?: {
    original_text: string;
    provider_used: string;
  };
  is_favorite?: boolean;
}

export default function DashboardPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [userContext, setUserContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [tone, setTone] = useState('professional');
  const [provider, setProvider] = useState<'cohere' | 'openrouter' | 'gemini'>('gemini');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [userSession, setUserSession] = useState<any>(null);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const [selectedJobDesc, setSelectedJobDesc] = useState('');

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Neural link required. Redirecting to auth...');
        router.push('/login');
      } else {
        setUserSession(session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUserSession(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleGenerate = async () => {
    if (!userSession) {
      toast.error('Neural link required. Redirecting to auth...');
      router.push('/login');
      return;
    }

    if (!jobDescription || jobDescription.length < 20) {
      toast.warning('Job description too short. Minimum 20 characters required.');
      return;
    }

    setIsGenerating(true);
    setGeneratedProposal('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSession.access_token}`
        },
        body: JSON.stringify({
          job_description: jobDescription,
          user_context: userContext,
          tone,
          provider
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Generation failed');
      }

      setGeneratedProposal(data.proposal);
      toast.success('Proposal generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      const msg = error.message || 'Check your neural link and provider settings.';
      toast.error(`Generation Failed: ${msg}`);
      setGeneratedProposal(`ERROR_LOG: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast.success('Copied to clipboard buffer');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedProposal], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "proposal.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Download initiated');
  };

  const handleSelectHistory = (item: ProposalHistoryItem) => {
    setGeneratedProposal(item.generated_text);
    if (item.job_descriptions) {
      setJobDescription(item.job_descriptions.original_text);
    }
    setTone(item.tone);
    const providerUsed = item.job_descriptions?.provider_used as 'cohere' | 'openrouter' | 'gemini' | undefined;
    setProvider(providerUsed || 'gemini');

    if (window.innerWidth < 768) {
      setHistorySidebarOpen(false);
    }

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  if (!userSession) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center font-mono">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin"></div>
          <span className="cyber-text-muted">AUTHENTICATING...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <HistorySidebar
        isOpen={historySidebarOpen}
        onToggle={() => setHistorySidebarOpen(!historySidebarOpen)}
        onSelectProposal={handleSelectHistory}
      />

      <div className="relative z-10 w-full text-[var(--foreground)] px-2 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24">
        <div className="max-w-5xl mx-auto pb-12 sm:pb-16">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 relative px-2">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--neon-cyan)] opacity-10 blur-3xl animate-pulse"></div>
            <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 relative z-10 break-words">
              PROPOSAL_GENERATOR.exe
            </h1>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 border-2 border-[var(--border-primary)] bg-[var(--background-glass)] backdrop-blur-sm">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[var(--neon-green)] animate-pulse shadow-[0_0_8px_var(--neon-green)]"></div>
              <span className="cyber-text-muted text-[8px] sm:text-[10px]">SYSTEM STATUS: ONLINE</span>
              <div className="w-px h-3 sm:h-4 bg-[var(--border-primary)]"></div>
              <span className="cyber-text-muted text-[8px] sm:text-[10px]">PROTOCOL: V2.0</span>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="mb-6 sm:mb-8 cyber-card hover:border-[var(--neon-cyan)]/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 border-b-2 border-[var(--border-primary)] pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-4 sm:h-6 bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]"></div>
                <span className="cyber-text-muted text-xs sm:text-sm uppercase tracking-[0.2em]">Input Stream</span>
              </div>
              <button
                onClick={() => setJobDescription('')}
                className="p-1.5 border border-[var(--border-primary)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 hover:shadow-[0_0_8px_var(--neon-cyan-glow)] transition-all rounded-sm group"
                title="Clear input"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-rotate-90 transition-transform duration-300" />
              </button>
            </div>
            <TerminalInput
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="> PASTE JOB DESCRIPTION HERE..."
              className="w-full h-48 sm:h-56 md:h-72 font-mono text-xs sm:text-sm"
            />
            <div className="mt-2 sm:mt-3 flex justify-between items-center cyber-text-muted text-[10px] sm:text-xs">
              <span>CHARACTERS: {jobDescription.length}</span>
              <span className={jobDescription.length < 20 ? 'text-[var(--neon-red)] drop-shadow-[0_0_5px_var(--neon-red)]' : 'text-[var(--neon-green)] drop-shadow-[0_0_5px_var(--neon-green)]'}>
                {jobDescription.length < 20 ? 'INSUFFICIENT DATA' : 'VALID INPUT'}
              </span>
            </div>
          </div>

          {/* User Context Section */}
          <div className="mb-6 sm:mb-8 cyber-card p-0 border-[var(--border-primary)] hover:border-[var(--neon-purple)]/50">
            <button
              onClick={() => setShowContext(!showContext)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <UserCircle className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--neon-purple)] group-hover:text-[var(--neon-cyan)] group-hover:drop-shadow-[0_0_8px_var(--neon-cyan)] transition-all" />
                <span className="cyber-text-muted text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] group-hover:text-[var(--neon-cyan)] transition-all text-left">
                  Personalized_Context.conf
                </span>
              </div>
              {showContext ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-[var(--foreground-muted)] group-hover:text-[var(--neon-cyan)] transition-colors" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-[var(--foreground-muted)] group-hover:text-[var(--neon-cyan)] transition-colors" />}
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${showContext ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t-2 border-[var(--border-primary)] mt-1 sm:mt-2">
                <p className="cyber-text-muted text-[10px] sm:text-xs mb-3 sm:mb-4 uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                  Define your identity, expertise, and notable projects to guide the agent.
                </p>
                <TerminalInput
                  value={userContext}
                  onChange={setUserContext}
                  placeholder={"> YOUR PROFILE:\n• Role & Title\n• Core Tech Stack\n• Years of Experience\n• Key Achievements\n• Experience/Work related to this job/project"}
                  className="w-full h-40 sm:h-32 md:h-40 text-xs sm:text-sm border-[var(--border-primary)] focus:border-[var(--neon-cyan)]"
                />
                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[var(--neon-cyan)]/70">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest leading-tight">AI will use this to match your profile to the job</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="mb-6 sm:mb-8 cyber-card hover:border-[var(--neon-pink)]/50 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b-2 border-[var(--border-primary)] pb-2 sm:pb-3">
              <div className="w-1 h-4 sm:h-6 bg-[var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink)]"></div>
              <span className="cyber-text-muted text-xs sm:text-sm uppercase tracking-[0.2em]">Configuration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Tone Selector */}
              <div>
                <span className="cyber-text-muted text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 block">TONE PROTOCOL</span>
                <div className="flex flex-wrap gap-2">
                  {['professional', 'friendly', 'direct'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] border-2 transition-all duration-300 relative overflow-hidden group ${
                        tone === t
                          ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 shadow-[0_0_15px_var(--neon-cyan-glow)]'
                          : 'border-[var(--border-primary)] text-[var(--foreground-muted)] hover:border-[var(--neon-purple)] hover:text-[var(--neon-purple)] hover:shadow-[0_0_10px_var(--neon-purple-glow)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Selector */}
              <div>
                <span className="cyber-text-muted text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 block">NEURAL PROVIDER</span>
                <div className="flex justify-start md:justify-center">
                  <ProviderSelector value={provider} onChange={setProvider} />
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="relative group mb-10 sm:mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-pink)] to-[var(--neon-purple)] blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <CyberButton
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!jobDescription || jobDescription.length < 20}
              className="w-full relative py-4 sm:py-6 text-sm sm:text-base border-2 break-words"
              variant="primary"
            >
              EXECUTE_GENERATION
            </CyberButton>
          </div>

          {/* Output Section */}
          <div className="min-h-[200px] sm:min-h-[300px]">
            {generatedProposal && (
              <div className="cyber-card p-4 sm:p-6 border-[var(--neon-cyan)] shadow-[0_0_40px_var(--neon-cyan-glow)] relative overflow-hidden">
                {/* Animated scan line effect */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-cyan-bright)] to-transparent opacity-50 shadow-[0_0_10px_var(--neon-cyan)] animate-[scan_3s_linear_infinite]"></div>
                </div>

                <div className="relative z-20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[var(--neon-cyan)]/30 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse shadow-[0_0_8px_var(--neon-cyan)]"></div>
                      <span className="cyber-text-muted text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">Output Stream</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={handleCopy}
                        className="p-1.5 sm:p-2 border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 hover:shadow-[0_0_10px_var(--neon-cyan-glow)] transition-all group"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-1.5 sm:p-2 border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] hover:bg-[var(--neon-pink)]/10 hover:shadow-[0_0_10px_var(--neon-pink-glow)] transition-all group"
                        title="Download as .txt"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-pink)] group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="p-1.5 sm:p-2 border-2 border-[var(--neon-purple)]/30 hover:border-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/10 hover:shadow-[0_0_10px_var(--neon-purple-glow)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-purple)] group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="cyber-text-primary leading-relaxed whitespace-pre-wrap font-mono text-xs sm:text-sm md:text-base break-words overflow-x-hidden">
                    <TypewriterText text={generatedProposal} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
