import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, context: any ) {
  const session = await auth()
  const { id } = context.params

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
