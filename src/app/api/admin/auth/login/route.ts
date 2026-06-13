import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || admin.status !== "Active") {
      return NextResponse.json({ error: "Invalid credentials or account disabled" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // Create Activity Log
    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: "LOGIN",
        description: "Admin logged into the system",
      }
    });

    // Create JWT
    const token = await new SignJWT({ id: admin.id, email: admin.email, role: admin.role, name: admin.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secretKey);

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    // Also set a non-httpOnly cookie for frontend simple checks (just a boolean)
    cookieStore.set("admin_auth_status", "logged_in", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
