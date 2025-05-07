//app/api/messages/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const withUserId = searchParams.get("with")

  if (!withUserId) return new NextResponse("User ID required", { status: 400 })

  const messages = await prisma.messagee.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: withUserId },
        { senderId: withUserId, receiverId: session.user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
      receiver: true,
    },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 })

  const { content, receiverId } = await req.json()

  const newMessage = await prisma.messagee.create({
    data: {
      content,
      senderId: session.user.id as string,
      receiverId,
    },
    include: { sender: true, receiver: true },
  })

  return NextResponse.json(newMessage)
}
export async function PUT(req: Request) {
    const session = await auth();
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
  
    const { messageId } = await req.json();
  
    try {
      const updatedMessage = await prisma.messagee.update({
        where: { id: messageId },
        data: { isRead: true },
      });
  
      return NextResponse.json({ message: 'Mesaj okundu olarak işaretlendi', updatedMessage });
    } catch (error) {
      console.error('Mesaj okuma hatası:', error);
      return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }

}