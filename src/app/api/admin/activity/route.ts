import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        admin: {
          select: { name: true }
        }
      }
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
