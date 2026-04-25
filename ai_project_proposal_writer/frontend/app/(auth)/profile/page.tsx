'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Camera, Save, Loader2, User, Mail, Lock, Trash2 } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Please sign in to view profile');
        router.push('/login');
        return;
      }
      setUser(session.user);
      setEmail(session.user.email || '');
      setFullName(session.user.user_metadata?.full_name || '');
      // Fetch avatar from profiles table
      supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        });
    });
  }, [router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Store base64 directly in profiles table
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: base64String
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        setAvatarUrl(base64String);
        toast.success('Avatar updated successfully');
        setLoading(false);
      };
      reader.onerror = (error) => {
        toast.error('Failed to read file');
        setLoading(false);
      };
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to upload avatar');
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      setAvatarUrl('');
      toast.success('Avatar removed successfully');
    } catch (error: any) {
      console.error('Avatar removal error:', error);
      toast.error(error.message || 'Failed to remove avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update auth metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: avatarUrl
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
          <span className="text-white">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid px-3 sm:px-4 py-4 sm:py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-cyan/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <div className="max-w-2xl mx-auto pt-20 sm:pt-24 px-1 sm:px-2">
        <h1 className="cyber-heading-xl text-2xl sm:text-4xl md:text-6xl text-center mb-8 sm:mb-12 break-words">
          PROFILE_SETTINGS
        </h1>

        {/* Avatar Section */}
        <div className="mb-6 sm:mb-8 cyber-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-mono text-neon-cyan mb-4 sm:mb-6 uppercase flex items-center gap-2">
            <Camera className="w-4 sm:w-5 h-4 sm:h-5" />
            Avatar
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover border-2 border-neon-cyan shadow-[0_0_20px_rgba(0,255,224,0.3)]"
                />
              ) : (
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-black/50 border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,255,224,0.3)]">
                  <span className="text-xl sm:text-2xl font-mono text-neon-cyan">
                    {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
              <label className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-neon-cyan text-neon-cyan font-mono text-xs sm:text-sm cursor-pointer hover:bg-neon-cyan/10 transition-colors">
                <Camera className="w-4 h-4" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-neon-pink text-neon-pink font-mono text-xs sm:text-sm cursor-pointer hover:bg-neon-pink/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Avatar</span>
                </button>
              )}
              <p className="text-[10px] sm:text-xs cyber-text-muted text-center sm:text-left">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="mb-6 sm:mb-8 cyber-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-mono text-neon-cyan mb-4 sm:mb-6 uppercase flex items-center gap-2">
            <User className="w-4 sm:w-5 h-4 sm:h-5" />
            Profile Information
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-sm font-mono cyber-text-muted mb-1.5 sm:mb-2 uppercase flex items-center gap-2">
                <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 border border-white/10 text-white/50 font-mono text-xs sm:text-sm rounded-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm font-mono cyber-text-muted mb-1.5 sm:mb-2 uppercase flex items-center gap-2">
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 border border-neon-cyan/30 text-white font-mono text-xs sm:text-sm focus:border-neon-cyan outline-none transition-colors"
              />
            </div>
            <CyberButton
              onClick={handleUpdateProfile}
              disabled={loading}
              variant="primary"
              className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
            >
              <Save className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              Save Changes
            </CyberButton>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="cyber-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-mono text-neon-pink mb-4 sm:mb-6 uppercase flex items-center gap-2">
            <Lock className="w-4 sm:w-5 h-4 sm:h-5" />
            Change Password
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-sm font-mono cyber-text-muted mb-1.5 sm:mb-2 uppercase flex items-center gap-2">
                <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 border border-neon-pink/30 text-white font-mono text-xs sm:text-sm focus:border-neon-pink outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm font-mono cyber-text-muted mb-1.5 sm:mb-2 uppercase flex items-center gap-2">
                <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 border border-neon-pink/30 text-white font-mono text-xs sm:text-sm focus:border-neon-pink outline-none transition-colors"
              />
            </div>
            <CyberButton
              onClick={handleChangePassword}
              disabled={loading || !newPassword || !confirmPassword}
              variant="secondary"
              className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
            >
              Change Password
            </CyberButton>
          </div>
        </div>
      </div>
    </div>
  );
}