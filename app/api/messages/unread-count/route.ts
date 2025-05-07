// /app/api/messages/unread-count/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Gönderen bazlı gruplanmış okunmamış mesaj sayıları
  const counts = await prisma.messagee.groupBy({
    by: ['senderId'],
    where: {
      receiverId: session.user.id,
      isRead: false,
    },
    _count: {
      _all: true,
    },
  });

  return NextResponse.json(counts);
}
