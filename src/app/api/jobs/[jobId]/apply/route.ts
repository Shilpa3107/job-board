import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Only candidates can apply to jobs" },
        { status: 403 }
      );
    }

    const { jobId } = await params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await request.json();
    const { resumeLink, note } = body;

    if (!resumeLink) {
      return NextResponse.json(
        { error: "Resume link is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: session.userId,
        resumeLink,
        note: note ?? null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}