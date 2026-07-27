"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    router.push("/jobs");
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto mt-16 px-6">
      <div className="panel p-8">
        <h1 className="font-display text-2xl mb-6">Log in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
          <button disabled={loading} className="btn-primary">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-5 text-sm" style={{ color: "var(--chalk-dim)" }}>
          No account yet? <Link href="/signup" className="underline" style={{ color: "var(--amber)" }}>Sign up</Link>
        </p>
      </div>
    </main>
  );
}