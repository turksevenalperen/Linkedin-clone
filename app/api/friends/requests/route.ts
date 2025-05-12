import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const requests = await prisma.friendship.findMany({
    where: {
      recipientId: currentUser.id,
      status: "pending",
    },
    include: {
      requester: true,
    },
  })

  return NextResponse.json(requests)
}
