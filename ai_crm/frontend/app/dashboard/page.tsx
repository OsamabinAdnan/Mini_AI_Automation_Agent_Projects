"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { insforge } from "@/lib/insforge";
import { Trash } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  updated_at: string;
};

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newTags, setNewTags] = useState("");

  function parseTags(value: string): string[] {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function resetForm() {
    setNewName("");
    setNewEmail("");
    setNewCompany("");
    setNewPhone("");
    setNewRole("");
    setNewNotes("");
    setNewTags("");
  }

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      window.history.replaceState({}, "", "/dashboard");
      setUserId(data.user.id);
      loadContacts(data.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadContacts(uid: string) {
    setLoading(true);
    setError(null);

    const { data, error } = await insforge.database
      .from("contacts")
      .select("id,name,company,email,updated_at")
      .eq("user_id", uid)
      .order("updated_at", { ascending: false });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Failed to load contacts");
      return;
    }

    setContacts((data ?? []) as Contact[]);
  }

  async function onSignOut() {
    await insforge.auth.signOut();
    window.location.href = "/login";
  }

  async function onAddContact(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setError(null);

    // Check for duplicate email if email is provided
    const emailToCheck = newEmail.trim();
    if (emailToCheck) {
      const { data: existing } = await insforge.database
        .from("contacts")
        .select("id")
        .eq("user_id", userId)
        .eq("email", emailToCheck)
        .maybeSingle();

      if (existing) {
        setError("A contact with this email already exists");
        return;
      }
    }

    const payload = {
      user_id: userId,
      name: newName.trim(),
      email: emailToCheck || null,
      company: newCompany.trim() || null,
      phone: newPhone.trim() || null,
      role: newRole.trim() || null,
      notes: newNotes.trim() || null,
      tags: parseTags(newTags),
    };

    const { error } = await insforge.database.from("contacts").insert([payload]);

    if (error) {
      setError(error.message ?? "Failed to add contact");
      return;
    }

    resetForm();
    await loadContacts(userId);
  }

  async function onDeleteContact(contactId: string, contactName: string) {
    if (!userId) return;

    if (!confirm(`Delete contact "${contactName}"? This cannot be undone.`)) {
      return;
    }

    setError(null);

    const { error } = await insforge.database
      .from("contacts")
      .delete()
      .eq("id", contactId)
      .eq("user_id", userId);

    if (error) {
      setError(error.message ?? "Failed to delete contact");
      return;
    }

    await loadContacts(userId);
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-black">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Dashboard</h1>
        </header>

        <section className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 shadow-lg shadow-cyan-500/10">
          <h2 className="text-base sm:text-lg font-semibold text-cyan-400 mb-3 sm:mb-4">Add contact</h2>
          <form className="grid gap-3 sm:grid-cols-2 md:grid-cols-3" onSubmit={onAddContact}>
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Email (optional)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
            />
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Company (optional)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              type="text"
            />
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Phone (optional)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              type="text"
            />
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Role (optional)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              type="text"
            />
            <input
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
              placeholder="Tags (comma-separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              type="text"
            />
            <textarea
              className="px-3 py-2 rounded-md bg-black/50 border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all md:col-span-3"
              placeholder="Notes (optional)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={3}
            />
            <div className="md:col-span-3">
              <button className="w-full sm:w-auto px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70">
                Add Contact
              </button>
            </div>
          </form>
          {error ? <p className="text-sm text-red-400 mt-3">{error}</p> : null}
        </section>

        <section className="border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg shadow-cyan-500/10">
          <div className="px-4 py-3 border-b border-cyan-500/30 bg-black/30">
            <h2 className="text-lg font-semibold text-cyan-400">Your contacts</h2>
          </div>

          {loading ? (
            <div className="p-4 text-sm text-gray-400">Loading…</div>
          ) : contacts.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">No contacts yet.</div>
          ) : (
            <ul className="divide-y divide-cyan-500/20">
              {contacts.map((c) => (
                <li key={c.id} className="p-3 sm:p-4 hover:bg-cyan-500/5 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{c.name}</div>
                      <div className="text-xs sm:text-sm text-gray-400 truncate">
                        {[c.company, c.email].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteContact(c.id, c.name)}
                        className="px-3 py-2 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center justify-center"
                        title="Delete contact"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <Link
                        className="px-4 py-2 rounded-md border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm text-center whitespace-nowrap"
                        href={`/dashboard/contacts/${c.id}`}
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
