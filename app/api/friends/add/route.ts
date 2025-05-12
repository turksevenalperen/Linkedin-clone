import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // kendi Auth.js setup'ına göre değiştir
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { recipientId } = await req.json();

  if (!recipientId) {
    return new NextResponse("Missing recipient ID", { status: 400 });
  }

  // Önceden arkadaşlık varsa ekleme
  const existing = await prisma.friendship.findFirst({
    where: {
      requesterId: currentUser.id,
      recipientId,
    },
  });

  if (existing) {
    return new NextResponse("Already sent", { status: 409 });
  }

  if (!currentUser.id) {
    return new NextResponse("Invalid user ID", { status: 400 });
  }

  await prisma.friendship.create({
    data: {
      requesterId: currentUser.id,
      recipientId,
    },
  });

  return NextResponse.json({ success: true });
}
