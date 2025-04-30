import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, content } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user!.id,
      postId
    }
  })

  return NextResponse.json(comment)
}
