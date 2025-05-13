import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const ALPEREN_ID = "cm9vponvp0000v10sa7yw6o3w" // Alperen'in user.id'si

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { content, imageUrl } = await req.json()

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const post = await prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId: user.id,
    },
    include: {
      author: { select: { name: true, email: true, image: true } },
      comments: { include: { user: true } },
      likes: true,
    },
  })

  return NextResponse.json(post)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json([], { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return NextResponse.json([], { status: 404 })

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: user.id, status: "accepted" },
        { recipientId: user.id, status: "accepted" },
      ],
    },
  })

  const friendIds = friendships.map(f =>
    f.requesterId === user.id ? f.recipientId : f.requesterId
  )

  const hasNoFriends = friendIds.length === 0
  const isAlperen = user.id === ALPEREN_ID

  let visibleAuthorIds: string[] = [user.id]

  if (hasNoFriends && !isAlperen) {
    visibleAuthorIds.push(ALPEREN_ID)
  } else if (!hasNoFriends) {
    visibleAuthorIds = [...friendIds, user.id]
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: visibleAuthorIds,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true, image: true } },
      comments: { include: { user: true } },
      likes: true,
    },
  })

  return NextResponse.json(posts)
}
