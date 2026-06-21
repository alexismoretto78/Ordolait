import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const receptions = await prisma.completedReception.findMany({
      orderBy: {
        completedAt: 'desc'
      }
    });
    return NextResponse.json(receptions);
  } catch (error) {
    console.error('Error fetching receptions:', error);
    return NextResponse.json({ error: 'Failed to fetch receptions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const reception = await prisma.completedReception.create({
      data: {
        lotNumber: data.lotNumber,
        volume: data.volume,
        protein: data.protein,
        fat: data.fat,
        milkType: data.milkType,
        deliveryDate: new Date(data.deliveryDate),
      }
    });
    
    return NextResponse.json(reception, { status: 201 });
  } catch (error) {
    console.error('Error creating reception:', error);
    return NextResponse.json({ error: 'Failed to create reception' }, { status: 500 });
  }
}
