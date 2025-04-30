import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: NextRequest, context: any) {
  const session = await auth()
  const { postId } = context.params

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const post = await prisma.post.findUnique({ where: { id: postId } })

    if (!post) {
      return NextResponse.json({ error: 'Post bulunamadı' }, { status: 404 })
    }

    if (post.authorId !== user.id) {
      return NextResponse.json({ error: 'Bu postu silme yetkin yok' }, { status: 403 })
    }

    await prisma.post.delete({ where: { id: postId } })

    return NextResponse.json({ message: 'Silindi' })
  } catch (err) {
    console.error('Silme hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
