import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ownership check: not just "are you an employer", but "did YOU post this job"
    if (job.postedById !== session.userId) {
      return NextResponse.json(
        { error: "You can only view applicants for your own job postings" },
        { status: 403 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      include: {
        candidate: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (err) {
    console.error("List applicants error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}