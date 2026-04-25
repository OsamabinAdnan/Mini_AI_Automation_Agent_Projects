'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, User, LogOut, Zap, Shield, Database, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const router = useRouter();

  const loadAvatar = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    setAvatarUrl(data?.avatar_url || '');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadAvatar(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadAvatar(session.user.id);
      } else {
        setUser(null);
        setAvatarUrl('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Neural link disconnected');
      router.push('/');
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--background-glass)] backdrop-blur-xl border-b-2 border-[var(--border-primary)] shadow-[0_0_20px_rgba(0,212,255,0.1)]">
      {/* Scan line effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--neon-cyan)] opacity-50 shadow-[0_0_10px_var(--neon-cyan)] animate-pulse"></div>

      <nav className="max-w-full mx-auto px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <Zap className="w-8 h-8 text-[var(--neon-cyan)] group-hover:text-[var(--neon-pink)] transition-all duration-500 drop-shadow-[0_0_8px_var(--neon-cyan)] group-hover:drop-shadow-[0_0_12px_var(--neon-pink)]" />
            <div className="absolute inset-0 w-8 h-8 bg-[var(--neon-cyan)] opacity-20 blur-xl group-hover:bg-[var(--neon-pink)] transition-colors duration-500"></div>
          </div>
          <div className="font-mono font-black text-xl lg:text-2xl tracking-[0.2em] text-[var(--foreground)] group-hover:text-[var(--neon-pink)] transition-all duration-500 group-hover:drop-shadow-[0_0_8px_var(--neon-pink)]">
            AI_PROPOSAL
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          <div className="flex items-center gap-4 xl:gap-8 font-mono text-[10px] xl:text-xs uppercase tracking-[0.2em]">
            {user && (
              <Link
                href="/dashboard"
                className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] hover:drop-shadow-[0_0_5px_var(--neon-cyan)] transition-all duration-300 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                DASHBOARD
              </Link>
            )}
            <Link
              href="/features"
              className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] hover:drop-shadow-[0_0_5px_var(--neon-cyan)] transition-all duration-300 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              FEATURES
            </Link>
            <Link
              href="/pricing"
              className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] hover:drop-shadow-[0_0_5px_var(--neon-cyan)] transition-all duration-300 flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              PRICING
            </Link>
            <Link
              href="/about"
              className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] hover:drop-shadow-[0_0_5px_var(--neon-cyan)] transition-all duration-300"
            >
              ABOUT
            </Link>
          </div>
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {user ? (
            <div className="flex items-center gap-4 xl:gap-6 font-mono text-[10px] xl:text-xs uppercase tracking-[0.2em]">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--neon-purple)] hover:drop-shadow-[0_0_5px_var(--neon-purple)] transition-all duration-300"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[var(--neon-cyan)]" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                PROFILE
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--neon-red)] hover:drop-shadow-[0_0_5px_var(--neon-red)] transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                DISCONNECT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 xl:gap-6 font-mono text-[10px] xl:text-xs uppercase tracking-[0.2em]">
              <Link
                href="/login"
                className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-all duration-300"
              >
                LOGIN
              </Link>
              <Link href="/signup">
                <button className="cyber-button-primary py-2 px-4 text-[10px] tracking-[0.3em]">
                  SIGNUP
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[var(--neon-cyan)] hover:text-[var(--neon-pink)] transition-colors duration-300 relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute inset-0 bg-[var(--neon-cyan)] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
          {isOpen ? <X className="w-6 h-6 relative z-10" /> : <Menu className="w-6 h-6 relative z-10" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[var(--background-tertiary)]/95 backdrop-blur-xl border-b-2 border-[var(--border-primary)] overflow-hidden"
          >
            <div className="cyber-container py-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-300"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-sm font-mono uppercase tracking-[0.2em]">DASHBOARD</span>
                  </Link>
                )}
                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-300"
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-mono uppercase tracking-[0.2em]">FEATURES</span>
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-300"
                >
                  <Database className="w-5 h-5" />
                  <span className="text-sm font-mono uppercase tracking-[0.2em]">PRICING</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-300"
                >
                  <span className="text-sm font-mono uppercase tracking-[0.2em]">ABOUT</span>
                </Link>
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t-2 border-[var(--border-primary)] space-y-4">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 text-[var(--neon-cyan)]"
                      onClick={() => setIsOpen(false)}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[var(--neon-cyan)]" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span className="text-sm font-mono uppercase tracking-[0.2em]">PROFILE</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 text-[var(--neon-red)] hover:text-[var(--neon-red)] transition-colors duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-mono uppercase tracking-[0.2em]">DISCONNECT</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-[var(--neon-cyan)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-sm font-mono uppercase tracking-[0.2em]">LOGIN</span>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <button className="cyber-button-primary w-full py-2 text-xs tracking-[0.3em]">
                        <span>SIGNUP</span>
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}