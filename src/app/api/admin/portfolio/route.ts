import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import initialData from '@/data/portfolio.json';
import { prisma } from '@/lib/prisma';

// Helper to check authentication
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token?.value;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const record = await prisma.portfolioData.findUnique({ where: { id: "singleton" } });
    if (record) {
      return NextResponse.json(record.data);
    }
    // Fallback to initial JSON if database is empty
    return NextResponse.json(initialData);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    return NextResponse.json({ error: 'Failed to load portfolio data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Read existing
    const record = await prisma.portfolioData.findUnique({ where: { id: "singleton" } });
    const currentData = record ? record.data as any : initialData;
    
    let newData;
    if (body.section && body.data !== undefined) {
      newData = {
        ...currentData,
        [body.section]: body.data
      };
    } else {
      newData = {
        ...currentData,
        ...body
      };
    }

    // Save back to DB
    await prisma.portfolioData.upsert({
      where: { id: "singleton" },
      update: { data: newData },
      create: { id: "singleton", data: newData }
    });
    
    return NextResponse.json({ success: true, message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
  }
}
