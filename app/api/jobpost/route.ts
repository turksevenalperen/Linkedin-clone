import { NextResponse } from "next/server"
import { auth } from "@/auth" // ✅ Auth.js fonksiyonu
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
        author: { connect: { id: session.user.id } } // ✅ artık ID kullanıyoruz
      }
    })
    return NextResponse.json(jobPost, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const jobPosts = await prisma.jobPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true }
    })
    return NextResponse.json(jobPosts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching job posts" }, { status: 500 })
  }
}
