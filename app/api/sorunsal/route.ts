// app/api/sorunsal/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title } = body;

  const newSorunsal = await prisma.sorunsal.create({
    data: {
      title,
      authorId: session.user.id ?? '',
    },
  });

  return NextResponse.json(newSorunsal);
}
