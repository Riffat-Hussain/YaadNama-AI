"use client";

import { useEffect, useState } from "react";
import RequireProfile from "@/components/RequireProfile";
import {
  getProfile,
  getEmergencyContacts,
  addEmergencyContact,
  deleteEmergencyContact,
} from "@/lib/storage";

function EmergencyContent() {
  const [profile, setProfileState] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });

  useEffect(() => {
    const p = getProfile();
    setProfileState(p);
    if (p) setContacts(getEmergencyContacts(p.name));
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    const c = addEmergencyContact(profile.name, form);
    setContacts((prev) => [...prev, c]);
    setForm({ name: "", phone: "", relation: "" });
  }

  function handleDelete(id) {
    deleteEmergencyContact(profile.name, id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-8">
      <section className="keepsake-card rounded-keepsake border-2 border-rose/30 p-6 shadow-keepsake">
        <h1 className="font-display text-3xl font-semibold text-rose-dark">Emergency SOS</h1>
        <p className="mt-1 text-inkfaint">
          Tap a contact below to call them right away.
        </p>
      </section>

      {contacts.length === 0 ? (
        <p className="text-inkfaint">
          No emergency contacts yet. Add someone below so they're one tap away.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.phone}`}
              className="keepsake-card flex items-center justify-between rounded-keepsake p-5 shadow-keepsake"
            >
              <div>
                <p className="font-display text-lg">{c.name}</p>
                <p className="text-sm text-inkfaint">{c.relation || "Contact"} · {c.phone}</p>
              </div>
              <span className="rounded-full bg-rose px-4 py-2 font-semibold text-white">Call</span>
            </a>
          ))}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="keepsake-card grid gap-3 rounded-keepsake p-6 shadow-keepsake sm:grid-cols-3"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal dark:bg-white/5"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone number"
          className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal dark:bg-white/5"
        />
        <input
          value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
          placeholder="Relation (e.g. Daughter)"
          className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal dark:bg-white/5"
        />
        <button
          type="submit"
          className="rounded-full bg-teal px-6 py-3 font-semibold text-white hover:bg-teal-dark sm:col-span-3"
        >
          Add contact
        </button>
      </form>

      <div
        onClick={() => {
          if (contacts[0]) window.location.href = `tel:${contacts[0].phone}`;
        }}
        className="cursor-pointer rounded-keepsake bg-rose py-6 text-center text-2xl font-bold text-white shadow-keepsake hover:bg-rose-dark"
      >
        🚨 Call my first emergency contact now
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <RequireProfile>
      <EmergencyContent />
    </RequireProfile>
  );
}
