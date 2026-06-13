import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadMedia } from "@/lib/cloudStorage";

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const cloudResponse = await uploadMedia(buffer, "portfolio_media", file.type);

    // Save to DB
    const media = await prisma.media.create({
      data: {
        fileName: file.name,
        publicId: cloudResponse.publicId,
        url: cloudResponse.url,
        mimeType: file.type || cloudResponse.resourceType,
        size: file.size || cloudResponse.bytes,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}
