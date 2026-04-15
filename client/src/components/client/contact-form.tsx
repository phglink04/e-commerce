"use client";

import { useState } from "react";

import { submitContact } from "@/lib/api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await submitContact({ name, email, contactNumber, message });
      setStatus("Message sent successfully.");
      setName("");
      setEmail("");
      setContactNumber("");
      setMessage("");
    } catch {
      setStatus("Failed to submit message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
      <p className="mt-1 text-sm text-slate-500">
        Have questions? Send us a message.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <input
        className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Contact Number (123-456-7890)"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        required
      />

      <textarea
        className="mt-4 h-40 w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-md bg-emerald-700 px-5 py-2 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
