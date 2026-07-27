"use client";

import { useEffect, useState } from "react";

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
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      {message && <p className="mb-4 text-sm text-blue-700">{message}</p>}

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Search by keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={loadJobs} className="border px-4 rounded">Search</button>
      </div>

      {me?.role === "EMPLOYER" && (
        <form onSubmit={handlePostJob} className="border p-4 rounded mb-8 flex flex-col gap-2">
          <h2 className="font-semibold">Post a job</h2>
          <input className="border p-2 rounded" placeholder="Title" required
            value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
          <textarea className="border p-2 rounded" placeholder="Description" required
            value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Location" required
            value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
          <select className="border p-2 rounded"
            value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="bg-black text-white p-2 rounded">Post job</button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded">
            <h3 className="font-bold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.location} · {job.jobType} · posted by {job.postedBy.name}</p>
            <p className="text-sm mt-2">{job.description}</p>

            <div className="flex gap-3 mt-3 text-sm">
              {me?.role === "CANDIDATE" && (
                <button className="underline" onClick={() => setApplyingTo(job.id)}>Apply</button>
              )}
              {me && (
                <a href={`/jobs/${job.id}/applicants`} className="underline">View applicants</a>
              )}
            </div>

            {applyingTo === job.id && (
              <form onSubmit={(e) => handleApply(job.id, e)} className="mt-3 flex flex-col gap-2">
                <input className="border p-2 rounded" placeholder="Resume link (URL)" required
                  value={applyForm.resumeLink}
                  onChange={(e) => setApplyForm({ ...applyForm, resumeLink: e.target.value })} />
                <textarea className="border p-2 rounded" placeholder="Note (optional)"
                  value={applyForm.note}
                  onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })} />
                <button className="bg-black text-white p-2 rounded w-fit">Submit application</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}