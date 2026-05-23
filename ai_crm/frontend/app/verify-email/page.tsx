"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { insforge } from "@/lib/insforge";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await insforge.auth.verifyEmail({
      email,
      otp,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Verification failed");
      return;
    }

    if (data?.user) {
      setMessage("Email verified. You can now login.");
      setTimeout(() => router.replace("/login"), 600);
    }
  }

  async function onResend() {
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await insforge.auth.resendVerificationEmail({
      email,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Failed to resend code");
      return;
    }

    if (data?.success) {
      setMessage("Verification code resent.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-[color:var(--border)] bg-[color:var(--card)] rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Verify email</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Enter the 6-digit code you received.
        </p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-transparent border border-[color:var(--border)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">6-digit code</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-transparent border border-[color:var(--border)] tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </div>

          {message ? (
            <p className="text-sm text-emerald-300">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            className="w-full px-4 py-2 rounded-md bg-white text-black text-sm font-medium disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>

        <button
          className="w-full px-4 py-2 rounded-md border border-[color:var(--border)] text-sm disabled:opacity-60"
          disabled={loading || !email}
          onClick={onResend}
          type="button"
        >
          Resend code
        </button>

        <p className="text-sm text-[color:var(--muted)]">
          <Link className="underline" href="/login">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="text-sm text-[color:var(--muted)]">Loading…</div>
        </main>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
