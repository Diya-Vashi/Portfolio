import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { pathname } = await request.json();
    
    if (!pathname) {
      return NextResponse.json({ error: "Pathname required" }, { status: 400 });
    }

    // Ignore admin routes and api routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const stat = await prisma.visitorStat.findFirst({
      where: { path: pathname }
    });

    if (stat) {
      await prisma.visitorStat.update({
        where: { id: stat.id },
        data: { views: { increment: 1 }, lastVisit: new Date() }
      });
    } else {
      await prisma.visitorStat.create({
        data: { path: pathname, views: 1 }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
