import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// api/messages/new-messages-count/route.ts
export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
  
    const unreadMessagesCount = await prisma.messagee.count({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
    });
  
    return NextResponse.json({ unreadMessagesCount });
  }
  