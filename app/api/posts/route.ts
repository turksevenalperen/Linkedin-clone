import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, imageUrl } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const post = await prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId: user.id,
    },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      },
      comments: { include: { user: true } },
      likes: true,
    },
  });

  return NextResponse.json(post);
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, email: true, image: true } },
      comments: { include: { user: true } },
      likes: true,
    },
  });

  return NextResponse.json(posts);
}
