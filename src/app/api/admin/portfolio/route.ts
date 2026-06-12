import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

// Helper to check authentication
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token?.value;
}

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
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
    // We expect { section: '...', data: { ... } } or just a full data object
    const body = await request.json();
    
    // Read existing
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const currentData = JSON.parse(fileContent);
    
    let newData;
    
    if (body.section && body.data !== undefined) {
      // Update just one section
      newData = {
        ...currentData,
        [body.section]: body.data
      };
    } else {
      // Merge full data
      newData = {
        ...currentData,
        ...body
      };
    }

    // Save back to file
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
  }
}
