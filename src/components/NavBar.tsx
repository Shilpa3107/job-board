"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string; role: "EMPLOYER" | "CANDIDATE" };

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b p-4 flex justify-between items-center">
      <a href="/jobs" className="font-bold">Job Board</a>
      <div className="flex items-center gap-4 text-sm">
        {loading ? null : user ? (
          <>
            <span>{user.name} ({user.role.toLowerCase()})</span>
            <button onClick={handleLogout} className="underline">Log out</button>
          </>
        ) : (
          <>
            <a href="/login" className="underline">Log in</a>
            <a href="/signup" className="underline">Sign up</a>
          </>
        )}
      </div>
    </nav>
  );
}