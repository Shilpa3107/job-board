"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <Link href="/jobs" className="font-bold">Job Board</Link>
      <div className="flex items-center gap-4 text-sm">
        {loading ? null : user ? (
          <>
            <span>{user.name} ({user.role.toLowerCase()})</span>
            <button onClick={handleLogout} className="underline">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="underline">Log in</Link>
            <Link href="/signup" className="underline">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}