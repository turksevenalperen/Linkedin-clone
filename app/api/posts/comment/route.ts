// app/api/posts/comment/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId, content } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user!.id,
      postId
    }
  });

  return NextResponse.json(comment);
}
