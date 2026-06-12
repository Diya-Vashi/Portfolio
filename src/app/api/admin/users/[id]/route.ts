import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Only allow updating specific fields
    const data: any = {};
    if (body.name) data.name = body.name;
    if (body.email) data.email = body.email;
    if (body.role) data.role = body.role;
    if (body.status) data.status = body.status;
    
    if (body.password) {
      data.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
