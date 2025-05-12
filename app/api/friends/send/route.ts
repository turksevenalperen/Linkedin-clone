import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const currentUserEmail = session?.user?.email;
  if (!currentUserEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipientId } = await req.json();

  const currentUser = await prisma.user.findUnique({
    where: { email: currentUserEmail },
  });

  if (!currentUser || !recipientId || recipientId === currentUser.id) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Check if friendship already exists (any status)
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: currentUser.id, recipientId },
        { requesterId: recipientId, recipientId: currentUser.id },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Zaten bir istek mevcut." }, { status: 400 });
  }

  await prisma.friendship.create({
    data: {
      requesterId: currentUser.id,
      recipientId,
      status: "pending",
    },
  });

  return NextResponse.json({ success: true });
}
