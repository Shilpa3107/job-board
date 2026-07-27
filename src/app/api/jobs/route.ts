import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const VALID_JOB_TYPES = ["FULL_TIME", "PART_TIME", "REMOTE"];

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Only employers can post jobs" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, location, jobType } = body;

    if (!title || !description || !location || !jobType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!VALID_JOB_TYPES.includes(jobType)) {
      return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        jobType,
        postedById: session.userId,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("Create job error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const location = searchParams.get("location");
    const jobType = searchParams.get("jobType");

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (jobType) {
      if (!VALID_JOB_TYPES.includes(jobType)) {
        return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
      }
      where.jobType = jobType;
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        postedBy: { select: { name: true } },
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (err) {
    console.error("List jobs error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}