import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId: user!.id, postId } }
  })

  if (existingLike) {
    await prisma.like.delete({ where: { userId_postId: { userId: user!.id, postId } } })
    return NextResponse.json({ liked: false })
  } else {
    await prisma.like.create({ data: { userId: user!.id, postId } })
    return NextResponse.json({ liked: true })
  }
}
