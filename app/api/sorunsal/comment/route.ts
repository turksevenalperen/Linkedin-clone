import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, sorunsalId } = await req.json();

  const comment = await prisma.sorunsalComment.create({
    data: {
      content,
      sorunsalId,
      userId: session.user.id as string,
    },
  });

  return NextResponse.json(comment);
}
