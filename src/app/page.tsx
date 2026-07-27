import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <p className="font-mono-tag text-xs tracking-widest uppercase mb-4" style={{ color: "var(--signal)" }}>
        Now boarding
      </p>
      <h1 className="font-display text-5xl sm:text-6xl leading-tight mb-6">
        Every open role,<br />one departures board.
      </h1>
      <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--chalk-dim)" }}>
        Employers post the opening. Candidates apply in one click.
        No noise, no endless filters — just who&apos;s hiring, and who&apos;s ready to go.
      </p>
      <div className="flex gap-4">
        <Link href="/jobs" className="btn-primary">Browse jobs</Link>
        <Link href="/signup" className="btn-ghost">Post a job</Link>
      </div>
    </main>
  );
}