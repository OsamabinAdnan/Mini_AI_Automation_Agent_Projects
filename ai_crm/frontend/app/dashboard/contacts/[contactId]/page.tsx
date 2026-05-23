"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  notes: string | null;
  tags: string[];
};

type Interaction = {
  id: string;
  type: "email" | "call" | "meeting" | "note";
  subject: string | null;
  content: string;
  interaction_date: string;
};

type AiSummary = {
  id: string;
  summary: string;
  next_actions: string[];
  relationship_status: "strong" | "needs_attention" | "new" | "dormant";
  generated_at: string;
};

export default function ContactDetailPage() {
  const params = useParams<{ contactId: string }>();
  const contactId = params.contactId;

  const [userId, setUserId] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [latestSummary, setLatestSummary] = useState<AiSummary | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const [newType, setNewType] = useState<Interaction["type"]>("note");
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUserId(data.user.id);
      loadAll(data.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  async function loadAll(uid: string) {
    setLoading(true);
    setError(null);

    const { data: c, error: cErr } = await insforge.database
      .from("contacts")
      .select("id,name,email,phone,company,role,notes,tags")
      .eq("id", contactId)
      .eq("user_id", uid)
      .maybeSingle();

    if (cErr) {
      setLoading(false);
      setError(cErr.message ?? "Failed to load contact");
      return;
    }

    if (!c) {
      setLoading(false);
      setError("Contact not found");
      return;
    }

    setContact(c as Contact);

    const { data: ints, error: iErr } = await insforge.database
      .from("interactions")
      .select("id,type,subject,content,interaction_date")
      .eq("contact_id", contactId)
      .eq("user_id", uid)
      .order("interaction_date", { ascending: false });

    if (iErr) {
      setLoading(false);
      setError(iErr.message ?? "Failed to load interactions");
      return;
    }

    setInteractions((ints ?? []) as Interaction[]);

    const { data: sums, error: sErr } = await insforge.database
      .from("contact_ai_summaries")
      .select("id,summary,next_actions,relationship_status,generated_at")
      .eq("contact_id", contactId)
      .eq("user_id", uid)
      .order("generated_at", { ascending: false })
      .limit(1);

    if (sErr) {
      setLoading(false);
      setError(sErr.message ?? "Failed to load AI summary");
      return;
    }

    setLatestSummary(((sums ?? [])[0] ?? null) as AiSummary | null);
    setLoading(false);
  }

  async function onAddInteraction(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setError(null);

    const payload = {
      user_id: userId,
      contact_id: contactId,
      type: newType,
      subject: newSubject.trim() || null,
      content: newContent.trim(),
    };

    const { error } = await insforge.database
      .from("interactions")
      .insert([payload]);

    if (error) {
      setError(error.message ?? "Failed to add interaction");
      return;
    }

    setNewSubject("");
    setNewContent("");
    await loadAll(userId);
  }

  async function onGenerateSummary() {
    setError(null);
    setAiLoading(true);

    const { error } = await insforge.functions.invoke("summarize-contact", {
      body: { contact_id: contactId },
    });

    setAiLoading(false);

    if (error) {
      setError(error.message ?? "AI summary failed");
      return;
    }

    if (userId) {
      await loadAll(userId);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-6 bg-black">
        <div className="max-w-4xl mx-auto text-sm text-gray-400">
          Loading…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-black">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <Link className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors" href="/dashboard">
              ← Back
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{contact?.name}</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              {[contact?.company, contact?.role, contact?.email]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50 disabled:opacity-60 whitespace-nowrap"
            disabled={aiLoading}
            onClick={onGenerateSummary}
            type="button"
          >
            {aiLoading ? "Generating…" : "Generate AI summary"}
          </button>
        </header>

        {error ? (
          <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md p-3">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 shadow-lg shadow-cyan-500/10">
            <h2 className="text-sm font-semibold text-cyan-400 mb-2">Contact notes</h2>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {contact?.notes || "(none)"}
            </p>
          </div>

          <div className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 shadow-lg shadow-cyan-500/10">
            <h2 className="text-sm font-semibold text-cyan-400 mb-2">AI summary</h2>
            {latestSummary ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{latestSummary.summary}</p>
                <div>
                  <div className="text-sm font-medium text-purple-400">Next actions</div>
                  <ul className="text-sm text-gray-400 list-disc pl-5 mt-1">
                    {latestSummary.next_actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-gray-500">
                  Status: {latestSummary.relationship_status} • Generated: {new Date(
                    latestSummary.generated_at
                  ).toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No AI summary yet.
              </p>
            )}
          </div>
        </section>

        <section className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 space-y-4 shadow-lg shadow-cyan-500/10">
          <h2 className="text-base sm:text-lg font-semibold text-cyan-400">Interactions</h2>

          <form className="grid gap-3 sm:grid-cols-2 md:grid-cols-4" onSubmit={onAddInteraction}>
            <select
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white transition-all [&>option]:bg-gray-900 [&>option]:text-white [&>option:checked]:bg-cyan-500/20"
              value={newType}
              onChange={(e) => setNewType(e.target.value as Interaction["type"])}
            >
              <option value="note" className="bg-gray-900 text-white">note</option>
              <option value="email" className="bg-gray-900 text-white">email</option>
              <option value="call" className="bg-gray-900 text-white">call</option>
              <option value="meeting" className="bg-gray-900 text-white">meeting</option>
            </select>
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all sm:col-span-1 md:col-span-3"
              placeholder="Subject (optional)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <textarea
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all sm:col-span-2 md:col-span-4"
              placeholder="What happened?"
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
            <div className="sm:col-span-2 md:col-span-4">
              <button className="w-full sm:w-auto px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50">
                Add interaction
              </button>
            </div>
          </form>

          {interactions.length === 0 ? (
            <p className="text-sm text-gray-400">No interactions yet.</p>
          ) : (
            <ul className="space-y-3">
              {interactions.map((i) => (
                <li
                  key={i.id}
                  className="border border-cyan-500/20 bg-black/30 rounded-md p-3 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="text-sm font-medium text-cyan-400">
                      {i.type}
                      {i.subject ? ` • ${i.subject}` : ""}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(i.interaction_date).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap mt-2">
                    {i.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
