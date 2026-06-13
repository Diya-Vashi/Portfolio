import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteMedia } from "@/lib/cloudStorage";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete from Cloudinary if publicId exists
    if (media.publicId) {
      const resourceType = media.mimeType.includes("image") ? "image" : media.mimeType.includes("video") ? "video" : "raw";
      try {
        await deleteMedia(media.publicId, resourceType as any);
      } catch (cloudErr) {
        console.error("Error deleting from Cloudinary, continuing with DB deletion:", cloudErr);
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
