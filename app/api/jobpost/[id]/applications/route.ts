import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: NextRequest, context: any) {
  const session = await auth();
  const { id } = context.params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobPost = await prisma.jobPost.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!jobPost) {
    return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 })
  }

  if (jobPost.author.email !== session.user?.email) {
    return NextResponse.json({ error: 'Sadece kendi ilanının başvurularını görebilirsin.' }, { status: 403 })
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobPostId: id },
    include: { applicant: true }
  })

  const applicants = applications.map(app => ({
    name: app.applicant.name,
    email: app.applicant.email,
  }))

  return NextResponse.json(applicants)
}
