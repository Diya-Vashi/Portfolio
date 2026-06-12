import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    // Convert array of {key, value} to an object
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settingsObj);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // body is an object of key-value pairs
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

    await prisma.siteSettings.delete({
      where: { key }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
