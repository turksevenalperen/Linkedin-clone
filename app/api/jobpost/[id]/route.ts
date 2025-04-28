// app/api/jobpost/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Params {
  params: { id: string }
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobPost = await prisma.jobPost.findUnique({
    where: { id: params.id },
    include: { author: true }
  })

  if (!jobPost) {
    return NextResponse.json({ error: 'İlan bulunamadı.' }, { status: 404 })
  }

  if (jobPost.author.email !== session.user?.email) {
    return NextResponse.json({ error: 'Sadece kendi ilanını silebilirsin.' }, { status: 403 })
  }

  await prisma.jobPost.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ message: 'İlan silindi.' }, { status: 200 })
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobPost = await prisma.jobPost.findUnique({
    where: { id: params.id },
    include: { author: true }
  })

  if (!jobPost) {
    return NextResponse.json({ error: 'İlan bulunamadı.' }, { status: 404 })
  }

  if (jobPost.author.email !== session.user?.email) {
    return NextResponse.json({ error: 'Sadece kendi ilanını düzenleyebilirsin.' }, { status: 403 })
  }

  const body = await req.json()

  const updatedJob = await prisma.jobPost.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      requirements: body.requirements,
      location: body.location,
      salary: body.salary,
    },
  })

  return NextResponse.json(updatedJob, { status: 200 })
}
