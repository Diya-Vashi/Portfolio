export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    const data: any = {};
    if (body.isRead !== undefined) data.isRead = body.isRead;
    if (body.isStarred !== undefined) data.isStarred = body.isStarred;
    if (body.isArchived !== undefined) data.isArchived = body.isArchived;

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data,
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to update message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.contactMessage.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
