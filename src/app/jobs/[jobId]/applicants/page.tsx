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
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex flex-col gap-4">
        {applicants.map((a) => (
          <div key={a.id} className="border p-4 rounded">
            <p className="font-semibold">{a.candidate.name} ({a.candidate.email})</p>
            <a href={a.resumeLink} className="underline text-sm" target="_blank">Resume</a>
            {a.note && <p className="text-sm mt-1">{a.note}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}