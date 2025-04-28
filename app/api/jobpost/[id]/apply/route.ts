import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Params {
  params: { id: string }
}

export async function POST(req: NextRequest,   { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existingApplication = await prisma.jobApplication.findFirst({
    where: {
      applicant: { email: session.user?.email! },
      jobPostId: id,
    }
  })

  if (existingApplication) {
    return NextResponse.json({ error: 'Zaten başvurmuşsun.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  const jobApplication = await prisma.jobApplication.create({
    data: {
      applicantId: user.id,
      jobPostId: id,
    },
  })

  return NextResponse.json(jobApplication, { status: 201 })
}
