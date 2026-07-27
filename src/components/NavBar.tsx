"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = { id: string; name: string; email: string; role: "EMPLOYER" | "CANDIDATE" };

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav style={{ borderBottom: "1px solid var(--panel-line)" }}>
      <div className="w-full px-6 sm:px-10 py-4 flex justify-between items-center">
        <Link href="/jobs" className="font-display text-lg tracking-wide uppercase">
          Job<span style={{ color: "var(--amber)" }}>Board</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {loading ? null : user ? (
            <>
              <span className="badge badge-role">
                {user.name} · {user.role === "EMPLOYER" ? "Employer" : "Candidate"}
              </span>
              <button onClick={handleLogout} className="btn-ghost text-xs">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs">Log in</Link>
              <Link href="/signup" className="btn-primary text-xs">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}