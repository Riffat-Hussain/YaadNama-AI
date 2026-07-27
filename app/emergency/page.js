"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, PhoneCall, Plus, ShieldAlert, Trash2, X } from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getEmergencyContacts, addEmergencyContact, deleteEmergencyContact } from "@/lib/storage";

function EmergencyContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [validation, setValidation] = useState({ name: "", phone: "" });

  useEffect(() => {
    async function loadData() {
      let email;
      if (DEMO_MODE) {
        const demoUser = localStorage.getItem("yaadnama_demo_user");
        if (demoUser) email = JSON.parse(demoUser).email;
      } else {
        const { session } = await getSession();
        email = session?.user?.email;
      }
      setUserEmail(email);
      if (email) setContacts(getEmergencyContacts(email));
    }
    loadData();
  }, []);

  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }, []);

  function validateForm() {
    const errors = { name: "", phone: "" };
    if (!form.name.trim()) errors.name = "Enter the contact's name.";
    if (!form.phone.trim()) errors.phone = "Enter a phone number.";
    else if (!/^[\d\s\-+()]{5,20}$/.test(form.phone.trim()))
      errors.phone = "Enter a valid phone number (5–20 digits/symbols).";
    setValidation(errors);
    return !errors.name && !errors.phone;
  }

  function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    if (!userEmail) {
      setError("Session not found. Try signing in again.");
      return;
    }
    try {
      const contact = addEmergencyContact(userEmail, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        relation: form.relation.trim(),
      });
      setContacts((prev) => [...prev, contact]);
      setForm({ name: "", phone: "", relation: "" });
      setValidation({ name: "", phone: "" });
      showSuccess(`${contact.name} added as an emergency contact.`);
    } catch (err) {
      setError("Could not save contact. Please try again.");
    }
  }

  function handleDelete(id) {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    setDeleting(id);
    // Brief delay for confirmation UX
    setTimeout(() => {
      deleteEmergencyContact(userEmail, id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setDeleting(null);
      showSuccess(`${contact.name} removed from emergency contacts.`);
    }, 200);
  }

  return (
    <div className="page-fade space-y-7">
      {/* SOS Banner */}
      <section className="rounded-keepsake border-2 border-rose/40 bg-gradient-to-br from-rose/15 via-rose/5 to-transparent p-6 shadow-[0_12px_40px_-16px_rgba(181,97,90,0.3)] dark:from-rose/20 dark:via-rose/10">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 animate-[pulse_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-rose text-white shadow-lg shadow-rose/30">
            <ShieldAlert aria-hidden="true" className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold text-rose-dark dark:text-rose-light">
              Emergency SOS
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-ink/75 dark:text-white/80">
              Your trusted contacts are always one tap away. Tap a contact to call them immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Action — Call Top Contact */}
      {contacts.length > 0 && (
        <a
          href={`tel:${contacts[0].phone}`}
          className="flex min-h-16 items-center justify-center gap-3 rounded-keepsake bg-gradient-to-r from-rose to-rose-dark px-6 text-center text-lg font-bold text-white shadow-[0_8px_32px_-8px_rgba(181,97,90,0.4)] transition duration-200 ease-out hover:shadow-[0_12px_40px_-8px_rgba(181,97,90,0.5)] active:scale-[0.98]"
        >
          <PhoneCall aria-hidden="true" className="h-6 w-6" />
          Call {contacts[0].name} now
        </a>
      )}

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald/20 dark:text-emerald-300">
          <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose/10 px-4 py-3 text-sm font-medium text-rose-dark">
          <X aria-hidden="true" className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Contact List */}
      <section aria-labelledby="contacts-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="contacts-heading" className="font-display text-2xl font-semibold text-ink dark:text-white">
              Emergency contacts
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Keep at least one person here if you can.
            </p>
          </div>
          <span
            className="rounded-full bg-rose/15 px-4 py-1.5 text-sm font-semibold text-rose-dark dark:bg-rose/20 dark:text-rose-light"
            aria-label={`${contacts.length} contact${contacts.length !== 1 ? "s" : ""}`}
          >
            {contacts.length}
          </span>
        </div>

        {contacts.length === 0 ? (
          <EmptyState
            icon={PhoneCall}
            title="Add someone you trust"
            description="Their phone number will appear here for quick calling when you need it most."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {contacts.map((contact) => (
              <Card key={contact.id} interactive className="p-0">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex min-h-28 items-center justify-between gap-3 p-5 outline-offset-[-4px]"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold text-ink dark:text-white">
                      {contact.name}
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted">
                      {contact.relation
                        ? `${contact.relation} · ${contact.phone}`
                        : contact.phone}
                    </span>
                  </span>
                  <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-dark active:scale-[0.97]">
                    <PhoneCall aria-hidden="true" className="h-4 w-4" />
                    Call
                  </span>
                </a>
                <div className="border-t border-surface-2 px-5 py-3 dark:border-white/10">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleting === contact.id}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-rose-dark transition hover:bg-rose/10 disabled:opacity-50"
                    aria-label={`Remove ${contact.name} from emergency contacts`}
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    {deleting === contact.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Add Contact Form */}
      <Card>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark">
          <Plus aria-hidden="true" className="h-4 w-4" />
          New contact
        </span>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink dark:text-white">
          Add an emergency contact
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          A name and phone number are all you need.
        </p>

        <form onSubmit={handleAdd} className="mt-5 grid gap-4 sm:grid-cols-3" noValidate>
          <div>
            <label htmlFor="contact-name" className="field-label">
              Full name <span className="text-rose-dark">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (validation.name) setValidation({ ...validation, name: "" });
              }}
              placeholder="For example: Ayesha"
              className={`input-field ${validation.name ? "border-rose-dark/40 ring-2 ring-rose/15" : ""}`}
              aria-invalid={!!validation.name}
              aria-describedby={validation.name ? "contact-name-error" : undefined}
            />
            {validation.name && (
              <p id="contact-name-error" className="mt-1.5 text-xs font-medium text-rose-dark">
                {validation.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-phone" className="field-label">
              Phone number <span className="text-rose-dark">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (validation.phone) setValidation({ ...validation, phone: "" });
              }}
              placeholder="+92 300 1234567"
              className={`input-field ${validation.phone ? "border-rose-dark/40 ring-2 ring-rose/15" : ""}`}
              aria-invalid={!!validation.phone}
              aria-describedby={validation.phone ? "contact-phone-error" : undefined}
            />
            {validation.phone && (
              <p id="contact-phone-error" className="mt-1.5 text-xs font-medium text-rose-dark">
                {validation.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-relation" className="field-label">
              Relationship <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="contact-relation"
              type="text"
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              placeholder="Daughter, neighbor…"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            className="btn-primary min-h-12 sm:col-span-3 sm:w-fit"
            aria-label="Add emergency contact"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Add contact
          </button>
        </form>
      </Card>
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

