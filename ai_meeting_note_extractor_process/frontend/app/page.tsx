'use client';

import { useState, useEffect, useRef } from 'react';
import { MeetingSummary } from './types';
import mammoth from 'mammoth';
import { BACKEND_URL } from './config';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/providers`);
        if (response.ok) {
          const data = await response.json();
          setProviders(data.providers);
          // Set default to empty string (auto) instead of first provider
          setSelectedProvider('');
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };
    fetchProviders();
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjs = await import('pdfjs-dist');

    // Use the local worker from public folder
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Filter for text items only and extract their strings
      const pageText = textContent.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => (item as any).str)
        .join(' ');

      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (
        file.type.includes('word') ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.doc') ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        extractedText = await extractTextFromWord(file);
      } else {
        // For text-based files (.txt, .md, .csv, .json)
        extractedText = await file.text();
      }

      setTranscript(extractedText);
    } catch (err) {
      setError(`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFileName(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (
        file.type.includes('word') ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.doc') ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        extractedText = await extractTextFromWord(file);
      } else {
        // For text-based files (.txt, .md, .csv, .json)
        extractedText = await file.text();
      }

      setTranscript(extractedText);
    } catch (err) {
      setError(`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFileName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestBody: { transcript: string; provider?: string } = { transcript };
      if (selectedProvider) requestBody.provider = selectedProvider;

      const response = await fetch(`${BACKEND_URL}/process-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFullReport = () => {
    if (!result) return;
    const report = `# Meeting Summary\n${result.summary}\n\n## Action Items\n${result.action_items.map((item, i) => `${i + 1}. ${item.task} — Owner: ${item.owner} | Due: ${item.deadline} | Priority: ${item.priority}`).join('\n')}\n\n## Decisions\n${result.decisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\n## Attendees\n${result.attendees.join(', ')}`;
    copyToClipboard(report);
  };

  const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
    high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="mb-6 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-ring" />
              <span className="text-xs font-mono text-muted uppercase tracking-widest">AI Agent System</span>
            </div>
            <p className="text-xs font-mono text-zinc-700">
              Built by <span className="text-accent">Osama bin Adnan</span> with <span className="text-accent-purple">🤖</span>
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-foreground">Meeting</span>
            <span className="text-accent text-glow-cyan">AI</span>
          </h1>
          <p className="text-muted mt-1 text-xs max-w-lg">
            Paste or upload a meeting transcript. An AI agent extracts summaries, action items, decisions, and attendees in seconds.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 overflow-hidden">
          {/* ── Left: Input Panel ── */}
          <div className="xl:col-span-5 flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 glow-border space-y-4 flex flex-col h-full overflow-hidden">
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-lg bg-zinc-900/80 border border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-1.5 text-[10px] font-mono rounded-md transition-all duration-300 ${activeTab === 'paste' ? 'bg-zinc-800 text-accent shadow-sm' : 'text-muted hover:text-foreground'}`}
                >
                  ⌨ Paste
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 text-[10px] font-mono rounded-md transition-all duration-300 ${activeTab === 'upload' ? 'bg-zinc-800 text-accent shadow-sm' : 'text-muted hover:text-foreground'}`}
                >
                  📁 Upload
                </button>
              </div>

              {/* Paste Tab */}
              {activeTab === 'paste' && (
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="textarea-cyber w-full flex-1 rounded-xl px-4 py-3 font-mono text-xs text-foreground placeholder:text-zinc-600 resize-none overflow-y-auto"
                  placeholder={`// Paste your meeting transcript here...

Example format:
ATTENDEES:
- John Smith (Project Manager)
- Sarah Johnson (Lead Developer)
- Mike Davis (Designer)

John (PM): Let's discuss the project timeline. Sarah, what's the status of the frontend?
Sarah (Lead Dev): The dashboard is 80% complete. I'll finish by Friday.
Mike (Designer): I've completed the new UI mockups.
John (PM): Decision - extend deadline by 2 days.
Action Item - Sarah (Lead Dev): Complete dashboard by Monday (Priority: High)

Include participant names with roles, decisions, action items, and deadlines for best results.`}
                />
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-accent/50 rounded-xl p-8 text-center transition-all duration-300 hover:bg-zinc-900/50 flex-1 flex flex-col items-center justify-center overflow-hidden"
                >
                  <input ref={fileInputRef} type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  <svg className="w-10 h-10 text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs text-zinc-400 font-mono">
                    Drop file here or <span className="text-accent">browse</span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1 font-mono">.txt  .md  .csv  .json  .pdf  .doc  .docx</p>
                  {fileName && (
                    <div className="mt-4 flex items-center gap-2 tag px-3 py-1.5 rounded-lg">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-mono text-zinc-300 truncate max-w-[150px]">{fileName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Select */}
              {providers.length > 0 && (
                <div className="shrink-0">
                  <label className="block text-[10px] font-mono text-muted mb-1 uppercase tracking-wider">Provider</label>
                  <p className="text-[9px] font-mono text-zinc-600 mb-1.5">Select &quot;auto&quot; for best results — free models are used, with auto-fallback.</p>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="select-cyber w-full rounded-lg px-3 py-2 text-xs text-foreground font-mono"
                  >
                    <option value="">auto</option>
                    {providers.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit and Clear buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={loading || !transcript.trim()}
                  className="btn-cyber flex-1 py-3 rounded-xl font-semibold text-xs text-zinc-900 disabled:text-zinc-500 tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      PROCESSING...
                    </span>
                  ) : (
                    'EXTRACT ACTION ITEMS →'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    setResult(null);
                    setError(null);
                    setFileName(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="btn-cyber py-3 px-4 rounded-xl font-semibold text-xs text-zinc-900 disabled:text-zinc-500 tracking-wide bg-zinc-600 hover:bg-zinc-700"
                >
                  CLEAR
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 shrink-0">
                  <p className="text-[10px] font-mono text-red-400">Error: {error}</p>
                </div>
              )}
            </form>
          </div>

          {/* ── Right: Results Panel ── */}
          <div className="xl:col-span-7 flex flex-col overflow-hidden h-full">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {loading && (
                <div className="glass rounded-2xl p-6 glow-border space-y-4">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="skeleton h-20 w-full rounded-lg" />
                  <div className="skeleton h-20 w-full rounded-lg" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              )}

              {result && (
                <>
                  {/* Summary */}
                  <div className="glass rounded-2xl p-5 glow-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-accent" />
                        <h2 className="text-xs font-mono uppercase tracking-widest text-accent">Summary</h2>
                      </div>
                      <button onClick={copyFullReport} className="tag px-2.5 py-1 rounded-lg text-[10px] font-mono text-muted hover:text-accent transition-colors flex items-center gap-1.5">
                        {copied ? (
                          <><svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                        ) : (
                          <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy report</>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Action Items */}
                  <div className="glass rounded-2xl p-5 glow-border">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 rounded-full bg-amber-400" />
                      <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">
                        Action Items
                      </h2>
                      <span className="tag px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted">{result.action_items.length}</span>
                    </div>
                    <div className="space-y-2.5">
                      {result.action_items.map((item, i) => {
                        const prio = priorityConfig[item.priority.toLowerCase()] || priorityConfig.low;
                        return (
                          <div key={i} className={`rounded-xl border ${prio.border} ${prio.bg} p-3.5`}>
                            <p className="text-xs font-medium text-zinc-200 mb-2.5">{item.task}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.owner !== 'TBD' && (
                                <span className="tag px-2 py-0.5 rounded-md text-[10px] font-mono text-blue-400 flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                  {item.owner}
                                </span>
                              )}
                              {item.deadline !== 'TBD' && (
                                <span className="tag px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  {item.deadline}
                                </span>
                              )}
                              <span className={`tag px-2 py-0.5 rounded-md text-[10px] font-mono ${prio.color} flex items-center gap-1`}>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decisions & Attendees Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    {/* Decisions */}
                    <div className="glass rounded-2xl p-5 glow-border">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 rounded-full bg-purple-400" />
                        <h2 className="text-xs font-mono uppercase tracking-widest text-purple-400">Decisions</h2>
                        <span className="tag px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted">{result.decisions.length}</span>
                      </div>
                      <div className="space-y-2">
                        {result.decisions.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 leading-normal">
                            <svg className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="glass rounded-2xl p-5 glow-border">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 rounded-full bg-blue-400" />
                        <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400">Attendees</h2>
                        <span className="tag px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted">{result.attendees.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.attendees.map((a, i) => (
                          <span key={i} className="tag px-2.5 py-1 rounded-lg text-[10px] font-mono text-blue-300 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-blue-400" />
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Empty State */}
              {!result && !loading && (
                <div className="glass rounded-2xl p-8 glow-border text-center h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-border flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">No data yet</h3>
                  <p className="text-[10px] text-zinc-600 max-w-xs leading-relaxed">
                    Paste or upload a meeting transcript, then hit extract to see the AI break it down.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}