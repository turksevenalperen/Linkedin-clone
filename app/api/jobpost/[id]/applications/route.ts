import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { AuthOptions } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobPost = await prisma.jobPost.findUnique({
    where: { id: params.id },
    include: { author: true },
  })

  if (!jobPost) {
    return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 })
  }

  if (jobPost.author.email !== session.user?.email) {
    return NextResponse.json({ error: 'Sadece kendi ilanının başvurularını görebilirsin.' }, { status: 403 })
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobPostId: params.id },
    include: { applicant: true }
  })
  console.log('Başvurular:', applications)

  const applicants = applications.map(app => ({
    name: app.applicant.name,
    email: app.applicant.email,
  }))

  return NextResponse.json(applicants)
}
