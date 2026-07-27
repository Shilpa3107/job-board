"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="CANDIDATE">I'm looking for a job</option>
          <option value="EMPLOYER">I'm hiring</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="underline">Log in</a>
      </p>
    </main>
  );
}