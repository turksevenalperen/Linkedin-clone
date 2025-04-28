// app/api/jobpost/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, requirements, location, salary } = body

  try {
    const jobPost = await prisma.jobPost.create({
      data: {
        title,
        description,
        requirements,
        location,
        salary,
        author: { connect: { email: session.user?.email! } }
      }
    })
    return NextResponse.json(jobPost, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const jobPosts = await prisma.jobPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    })
    return NextResponse.json(jobPosts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching job posts' }, { status: 500 })
  }
}
