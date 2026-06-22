import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const commands = await prisma.completedCommand.findMany({
      include: {
        references: true,
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    return NextResponse.json(commands);
  } catch (error) {
    console.error('Error fetching commands:', error);
    return NextResponse.json({ error: 'Failed to fetch commands' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Create the command with its references
    const command = await prisma.completedCommand.create({
      data: {
        name: data.name,
        status: data.status,
        whiteMassKg: data.whiteMassKg,
        milkReceivedVolume: data.milkReceivedVolume,
        targetValue: data.targetValue,
        osmosedVolume: data.osmosedVolume,
        milkType: data.milkType,
        isSkyr: data.isSkyr,
        references: {
          create: data.references.map((ref: any) => ({
            name: ref.name,
            potsQty: ref.potsQty,
            gramPerPot: ref.gramPerPot
          }))
        }
      },
      include: {
        references: true,
      }
    });
    
    return NextResponse.json(command, { status: 201 });
  } catch (error) {
    console.error('Error creating command:', error);
    return NextResponse.json({ error: 'Failed to create command' }, { status: 500 });
  }
}
