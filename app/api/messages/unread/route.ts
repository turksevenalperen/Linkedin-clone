// /app/api/messages/unread/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const unreadMessages = await prisma.messagee.findMany({
    where: {
      receiverId: session.user.id,
      isRead: false,
    },
    include: {
      sender: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(unreadMessages);
}

export async function PUT() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Tüm mesajları okundu olarak işaretle
  await prisma.messagee.updateMany({
    where: {
      receiverId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json({ message: "Mesajlar okundu olarak işaretlendi" });
}
