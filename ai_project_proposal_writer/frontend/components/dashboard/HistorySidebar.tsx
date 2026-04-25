'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  History,
  Clock,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  StarOff,
  X
} from 'lucide-react';

interface ProposalHistory {
  id: string;
  generated_text: string;
  tone: string;
  model_used: string;
  created_at: string;
  job_descriptions: {
    original_text: string;
    provider_used: string;
  };
  is_favorite?: boolean;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectProposal: (proposal: ProposalHistory) => void;
}

export function HistorySidebar({ isOpen, onToggle, onSelectProposal }: HistorySidebarProps) {
  const [history, setHistory] = useState<ProposalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load proposal history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && history.length === 0) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Proposal deleted');
    } catch (error) {
      toast.error('Failed to delete proposal');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_favorite: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      setHistory(prev => prev.map(item =>
        item.id === id ? { ...item, is_favorite: !currentStatus } : item
      ));
      toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  // Filter history based on favorites toggle
  const filteredHistory = showFavoritesOnly
    ? history.filter(item => item.is_favorite)
    : history;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-black/80 backdrop-blur-sm border-y-2 border-r-2 border-neon-cyan/30 p-3 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,224,0.3)] hidden md:block"
        style={{ left: isOpen ? '320px' : '0' }}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(0,255,224,0.8)]" />
        ) : (
          <ChevronRight className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(0,255,224,0.8)]" />
        )}
      </button>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/80 backdrop-blur-sm border-2 border-neon-cyan/30 px-6 py-3 rounded-full hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,224,0.3)] flex items-center gap-2"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <History className="w-4 h-4 text-neon-cyan" />
        <span className="text-neon-cyan font-mono text-xs uppercase tracking-wider">History</span>
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
<motion.aside
        initial={{ x: -400 }}
        animate={{ x: isOpen ? 0 : -400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-[80%] max-w-[320px] md:w-[320px] cyber-grid bg-black/90 backdrop-blur-xl border-r-2 border-neon-cyan/30 z-50 shadow-[5px_0_30px_rgba(0,255,224,0.15)]"
      >
        {/* Background glow effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="p-6 border-b-2 border-neon-cyan/30 bg-black/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <History className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,224,0.8)]" />
                  <div className="absolute inset-0 w-6 h-6 bg-neon-cyan opacity-20 blur-md" />
                </div>
                <h2 className="text-lg font-mono text-white uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(0,255,224,0.5)]">
                  History
                </h2>
              </div>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-neon-pink/10 text-[#666] hover:text-neon-pink rounded transition-colors hover:shadow-[0_0_10px_rgba(255,0,127,0.3)]"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] font-mono text-cyber-text-muted mt-3 uppercase tracking-[0.3em]">
              {filteredHistory.length} PROPOSAL{filteredHistory.length !== 1 ? 'S' : ''} {showFavoritesOnly ? 'FAVORITED' : 'STORED'}
            </p>

            {/* Filter Toggle */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className={`px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.2em] border transition-all duration-300 ${
                  !showFavoritesOnly
                    ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,255,224,0.3)]'
                    : 'border-white/20 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setShowFavoritesOnly(true)}
                className={`px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.2em] border transition-all duration-300 ${
                  showFavoritesOnly
                    ? 'border-neon-yellow text-neon-yellow bg-neon-yellow/10 shadow-[0_0_10px_rgba(255,230,0,0.3)]'
                    : 'border-white/20 text-white/60 hover:border-neon-yellow/50 hover:text-neon-yellow/80'
                }`}
              >
                ⭐ Favorites
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(0,255,224,0.5)]" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                {showFavoritesOnly ? (
                  <>
                    <Star className="w-16 h-16 text-[#333] mx-auto mb-4" />
                    <p className="text-cyber-text-muted font-mono text-sm uppercase tracking-wider">No favorites yet</p>
                    <p className="text-[#333] font-mono text-xs mt-2 uppercase tracking-[0.2em]">Star proposals to save them here!</p>
                  </>
                ) : (
                  <>
                    <FileText className="w-16 h-16 text-[#333] mx-auto mb-4" />
                    <p className="text-cyber-text-muted font-mono text-sm uppercase tracking-wider">No proposals yet</p>
                    <p className="text-[#333] font-mono text-xs mt-2 uppercase tracking-[0.2em]">Generate your first proposal!</p>
                  </>
                )}
              </div>
            ) : (
              filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => {
                    setSelectedId(item.id);
                    onSelectProposal(item);
                  }}
                  className={`p-4 border-2 cursor-pointer transition-all duration-200 group cyber-card ${
                    selectedId === item.id
                      ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,255,224,0.2)]'
                      : 'border-white/10 bg-black/50 hover:border-neon-purple/50 hover:shadow-[0_0_15px_rgba(157,0,255,0.15)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,224,0.8)]" />
                      <span className="text-[9px] font-mono text-neon-cyan uppercase tracking-wider">
                        {item.model_used || item.job_descriptions?.provider_used || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleFavorite(e, item.id, item.is_favorite || false)}
                        className="p-1.5 hover:bg-neon-yellow/10 rounded transition-colors"
                      >
                        {item.is_favorite ? (
                          <Star className="w-4 h-4 text-[var(--neon-yellow)] fill-[var(--neon-yellow)] drop-shadow-[0_0_8px_var(--neon-yellow)] transition-transform group-hover:scale-110" />
                        ) : (
                          <Star className="w-4 h-4 text-[#666] hover:text-[var(--neon-yellow)] transition-colors" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1.5 hover:bg-neon-pink/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#666] hover:text-[var(--neon-pink)] drop-shadow-[0_0_3px_rgba(255,0,127,0.5)] transition-colors" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#E0E0E0] font-mono text-[10px] line-clamp-2 leading-relaxed uppercase tracking-wide">
                    {item.generated_text.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-cyber-text-muted">
                      <Clock className="w-3 h-3" />
                      <span className="text-[8px] font-mono uppercase tracking-[0.15em]">{formatDate(item.created_at)}</span>
                    </div>
                    <span className={`text-[7px] font-mono uppercase tracking-[0.2em] px-2 py-1.5 border-2 ${
                      item.tone === 'professional' ? 'border-neon-cyan text-neon-cyan shadow-[0_0_8px_rgba(0,255,224,0.3)]' :
                      item.tone === 'friendly' ? 'border-neon-pink text-neon-pink shadow-[0_0_8px_rgba(255,0,127,0.3)]' :
                      'border-neon-yellow text-neon-yellow shadow-[0_0_8px_rgba(255,230,0,0.3)]'
                    }`}>
                      {item.tone}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
