"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "REMOTE"];

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  postedBy: { name: string };
};

type Me = { id: string; role: "EMPLOYER" | "CANDIDATE" } | null;

export default function JobsPage() {
  const [me, setMe] = useState<Me>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState("");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ resumeLink: "", note: "" });
  const [message, setMessage] = useState("");

  const [newJob, setNewJob] = useState({
    title: "", description: "", location: "", jobType: "FULL_TIME",
  });

  async function loadJobs() {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    const res = await fetch(`/api/jobs?${params}`);
    if (res.ok) setJobs(await res.json());
  }

  useEffect(() => {
    fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)).then(setMe);
    loadJobs();
  }, []);

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setNewJob({ title: "", description: "", location: "", jobType: "FULL_TIME" });
    loadJobs();
  }

  async function handleApply(jobId: string, e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applyForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setMessage("Application submitted.");
    setApplyingTo(null);
    setApplyForm({ resumeLink: "", note: "" });
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <p className="font-mono-tag text-xs tracking-widest uppercase mb-2" style={{ color: "var(--signal)" }}>
        Departures
      </p>
      <h1 className="font-display text-3xl mb-6">Open roles</h1>

      {message && (
        <p className="mb-4 text-sm px-4 py-2 panel" style={{ color: "var(--amber)" }}>{message}</p>
      )}

      <div className="flex gap-2 mb-8">
        <input
          className="field"
          placeholder="Search by keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={loadJobs} className="btn-ghost whitespace-nowrap">Search</button>
      </div>

      {me?.role === "EMPLOYER" && (
        <form onSubmit={handlePostJob} className="panel p-6 mb-10 flex flex-col gap-3">
          <h2 className="font-display text-lg mb-1">Post a job</h2>
          <input className="field" placeholder="Title" required
            value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
          <textarea className="field" placeholder="Description" required
            value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
          <input className="field" placeholder="Location" required
            value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
          <select className="field"
            value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
          <button className="btn-primary w-fit">Post job</button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {jobs.length === 0 && (
          <p className="text-sm" style={{ color: "var(--chalk-dim)" }}>No roles posted yet.</p>
        )}
        {jobs.map((job, i) => (
          <div
            key={job.id}
            className="panel card-hover animate-in p-6 flex flex-col"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="badge badge-open">
                <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--signal)" }} />
                Open
              </span>
            </div>
            <h3 className="font-display text-xl mb-1">{job.title}</h3>
            <p className="font-mono-tag text-xs mb-3" style={{ color: "var(--chalk-dim)" }}>
              {job.location.toUpperCase()} · {job.jobType.replace("_", " ")} · POSTED BY {job.postedBy.name.toUpperCase()}
            </p>
            <p className="text-sm mb-4 flex-1" style={{ color: "var(--chalk)" }}>{job.description}</p>

            <div className="flex gap-4 text-sm">
              {me?.role === "CANDIDATE" && (
                <button className="underline" style={{ color: "var(--amber)" }} onClick={() => setApplyingTo(job.id)}>
                  Apply
                </button>
              )}
              {me && (
                <Link href={`/jobs/${job.id}/applicants`} className="underline" style={{ color: "var(--chalk-dim)" }}>
                  View applicants
                </Link>
              )}
            </div>

            {applyingTo === job.id && (
              <form onSubmit={(e) => handleApply(job.id, e)} className="mt-4 flex flex-col gap-2">
                <input className="field" placeholder="Resume link (URL)" required
                  value={applyForm.resumeLink}
                  onChange={(e) => setApplyForm({ ...applyForm, resumeLink: e.target.value })} />
                <textarea className="field" placeholder="Note (optional)"
                  value={applyForm.note}
                  onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })} />
                <button className="btn-primary w-fit">Submit application</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}