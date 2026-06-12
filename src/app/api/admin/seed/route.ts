import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("admin", 10);
    const admin = await prisma.adminUser.upsert({
      where: { email: "vashidiya@gmail.com" },
      update: { passwordHash },
      create: {
        name: "Diya Vashi",
        email: "vashidiya@gmail.com",
        passwordHash,
        role: "SuperAdmin"
      }
    });
    return NextResponse.json({ success: true, admin });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
