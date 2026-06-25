import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const appState = await prisma.appState.findUnique({
      where: { id: "singleton" }
    });
    
    if (!appState) {
      return NextResponse.json({ data: null });
    }
    
    return NextResponse.json({ data: appState.data });
  } catch (error) {
    console.error('Error fetching state:', error);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    
    const appState = await prisma.appState.upsert({
      where: { id: "singleton" },
      update: {
        data: data
      },
      create: {
        id: "singleton",
        data: data
      }
    });
    
    return NextResponse.json({ success: true, updatedAt: appState.updatedAt });
  } catch (error) {
    console.error('Error saving state:', error);
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
  }
}
