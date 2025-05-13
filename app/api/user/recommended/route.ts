// app/api/users/recommended/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  const currentUserEmail = session?.user?.email

  if (!currentUserEmail) return NextResponse.json([], { status: 200 })

  const currentUser = await prisma.user.findUnique({
    where: { email: currentUserEmail },
  })

  if (!currentUser) return NextResponse.json([], { status: 200 })

  // Halihazırda bağlantısı olan kullanıcıları bul
  const connections = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: currentUser.id },
        { recipientId: currentUser.id },
      ],
    },
  })

  const connectedIds = new Set<string>()
  connections.forEach(c => {
    connectedIds.add(c.requesterId)
    connectedIds.add(c.recipientId)
  })
  connectedIds.add(currentUser.id)

  const recommended = await prisma.user.findMany({
    where: {
      NOT: {
        id: {
          in: Array.from(connectedIds),
        },
      },
    },
    take: 5,
    select: {
      id: true,
      name: true,
      image: true,
    },
  })

  return NextResponse.json(recommended)
}
