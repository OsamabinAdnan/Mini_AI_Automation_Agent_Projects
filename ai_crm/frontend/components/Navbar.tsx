"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, [pathname]);

  async function handleSignOut() {
    await insforge.auth.signOut();
    window.location.href = "/";
  }

  function getInitials(user: { name?: string; email?: string } | null): string {
    if (!user) return "?";
    if (user.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  }

  return (
    <nav className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Personal AI CRM
        </Link>

        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/dashboard"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50"
                  title="Profile"
                >
                  {getInitials(user)}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 sm:px-4 py-2 text-lg sm:text-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all rounded-md flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : !isAuthPage ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </nav>
  );
}
