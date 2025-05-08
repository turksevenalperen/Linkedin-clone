//api/messages/mark-read/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const withUserId = searchParams.get("with")

  if (!withUserId) {
    return new NextResponse("User ID required", { status: 400 })
  }

  try {
    // Belirli bir kullanıcıdan gelen tüm mesajları okundu olarak işaretle
    await prisma.messagee.updateMany({
      where: {
        senderId: withUserId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json({ message: "Mesajlar okundu olarak işaretlendi" })
  } catch (error) {
    console.error("Mesajları okundu işaretleme hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}
