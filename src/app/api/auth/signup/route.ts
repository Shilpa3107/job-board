import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, name } = body;

    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role !== "EMPLOYER" && role !== "CANDIDATE") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        name,
      },
    });

    const token = await createSession({ userId: user.id, role: user.role });

    const response = NextResponse.json(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      { status: 201 }
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}