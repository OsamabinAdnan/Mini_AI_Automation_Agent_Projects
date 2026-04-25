'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CyberButton } from '@/components/ui/CyberButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Lock, Mail, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
      } else if (data?.session) {
        console.log('Login success:', data);
        toast.success('Logged in successfully');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error('Login failed: No session created');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 cyber-grid relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-cyan/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-purple/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <div className="w-full max-w-sm mb-6 sm:mb-8 text-center space-y-2 px-2">
        <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-5xl mb-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 break-words">
          <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-neon-cyan" />
          SYSTEM_ACCESS
        </h1>
        <p className="cyber-text-muted text-xs sm:text-sm">Enter credentials to establish connection</p>
      </div>

      <form onSubmit={handleLogin} className="cyber-card w-full max-w-sm space-y-4 sm:space-y-6 p-4 sm:p-8 relative">
        <div className="space-y-2">
          <Label className="cyber-text-muted flex items-center gap-2 text-xs sm:text-sm">
            <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            Email
          </Label>
          <Input
            type="email"
            placeholder="cyber@user.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black/50 border-neon-cyan/30 focus:border-neon-cyan text-white placeholder:text-white/20 text-xs sm:text-sm py-1.5 sm:py-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="cyber-text-muted flex items-center gap-2 text-xs sm:text-sm">
            <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            Password
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black/50 border-neon-cyan/30 focus:border-neon-cyan text-white placeholder:text-white/20 text-xs sm:text-sm py-1.5 sm:py-2"
          />
        </div>
        <CyberButton
          type="submit"
          loading={loading}
          variant="primary"
          className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
        >
          Initialize Connection
        </CyberButton>

        <div className="pt-3 sm:pt-4 text-center border-t border-white/5">
          <p className="text-xs sm:text-sm cyber-text-muted">
            New operator?{' '}
            <Link href="/signup" className="text-neon-cyan hover:text-white transition-colors duration-200">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
