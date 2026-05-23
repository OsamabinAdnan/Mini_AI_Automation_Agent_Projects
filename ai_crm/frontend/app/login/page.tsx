"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { insforge } from "@/lib/insforge";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("insforge_status");
  const type = searchParams.get("insforge_type");

  const verificationMessage = useMemo(() => {
    if (type !== "verify_email") return null;
    if (status === "success") return "Email verified. Please sign in.";
    if (status === "error") return "Email verification failed. Please retry.";
    return null;
  }, [status, type]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<null | "google" | "github">(null);

  async function onOAuth(provider: "google" | "github") {
    setError(null);
    setOauthLoading(provider);

    const { error } = await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: `${window.location.origin}/dashboard`,
    });

    if (error) {
      setOauthLoading(null);
      setError(error.message ?? "OAuth sign-in failed");
      return;
    }

    // Success triggers a browser redirect.
  }

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard");
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Login failed");
      return;
    }

    if (data?.user) {
      router.replace("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-black">
      <div className="w-full max-w-md border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 space-y-4 shadow-lg shadow-cyan-500/10">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Login</h1>

        {verificationMessage ? (
          <div className="text-sm border border-cyan-500/30 bg-cyan-500/10 rounded-md p-3 text-cyan-300">
            {verificationMessage}
          </div>
        ) : null}

        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 rounded-md border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm disabled:opacity-60"
            disabled={!!oauthLoading}
            onClick={() => onOAuth("google")}
            type="button"
          >
            {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
          </button>
          <button
            className="w-full px-4 py-2 rounded-md border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm disabled:opacity-60"
            disabled={!!oauthLoading}
            onClick={() => onOAuth("github")}
            type="button"
          >
            {oauthLoading === "github" ? "Redirecting…" : "Continue with GitHub"}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">or</div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-gray-400">
          No account?{" "}
          <Link className="text-cyan-400 hover:text-cyan-300 transition-colors" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="text-sm text-[color:var(--muted)]">Loading…</div>
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
