"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Applicant = {
  id: string;
  resumeLink: string;
  note: string | null;
  createdAt: string;
  candidate: { name: string; email: string };
};

export default function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${jobId}/applicants`).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setApplicants(data);
    });
  }, [jobId]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <p className="font-mono-tag text-xs tracking-widest uppercase mb-2" style={{ color: "var(--signal)" }}>
        Arrivals
      </p>
      <h1 className="font-display text-3xl mb-6">Applicants</h1>
      {error && (
        <p className="panel p-4 text-sm" style={{ color: "var(--danger)" }}>{error}</p>
      )}
      <div className="panel">
        {applicants.map((a) => (
          <div key={a.id} className="board-row px-6 py-5">
            <p className="font-display text-lg">{a.candidate.name}</p>
            <p className="font-mono-tag text-xs" style={{ color: "var(--chalk-dim)" }}>{a.candidate.email}</p>
            <a href={a.resumeLink} className="underline text-sm" style={{ color: "var(--amber)" }} target="_blank" rel="noreferrer">
              Resume
            </a>
            {a.note && <p className="text-sm mt-2">{a.note}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}