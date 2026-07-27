"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Signup failed");
      return;
    }

    router.push("/jobs");
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto mt-16 px-6">
      <div className="panel p-8">
        <h1 className="font-display text-2xl mb-6">Create an account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="field"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CANDIDATE">I&apos;m looking for a job</option>
            <option value="EMPLOYER">I&apos;m hiring</option>
          </select>
          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
          <button disabled={loading} className="btn-primary">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-5 text-sm" style={{ color: "var(--chalk-dim)" }}>
          Already have an account? <Link href="/login" className="underline" style={{ color: "var(--amber)" }}>Log in</Link>
        </p>
      </div>
    </main>
  );
}