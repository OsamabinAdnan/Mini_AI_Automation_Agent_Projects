"use client";

import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";
import { LogOut } from "lucide-react";

type User = {
  id: string;
  email?: string;
  name?: string;
  created_at?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (error || !data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user as User);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    await insforge.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-6 bg-black">
        <div className="max-w-2xl mx-auto text-sm text-gray-400">
          Loading…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-black">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Profile
          </h1>
        </header>

        <section className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-lg shadow-cyan-500/10">
          <div className="space-y-4">
            {user?.name && (
              <div>
                <label className="text-sm text-gray-500 uppercase tracking-wide">Name</label>
                <p className="text-lg text-white mt-1">{user.name}</p>
              </div>
            )}

            {user?.email && (
              <div>
                <label className="text-sm text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-lg text-white mt-1">{user.email}</p>
              </div>
            )}

            {user?.created_at && (
              <div>
                <label className="text-sm text-gray-500 uppercase tracking-wide">Member Since</label>
                <p className="text-lg text-white mt-1">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-cyan-500/20">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium hover:from-red-600 hover:to-pink-700 transition-all shadow-lg shadow-red-500/50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

        {error && (
          <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md p-3">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
