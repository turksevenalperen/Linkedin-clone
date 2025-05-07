//api/user/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: session?.user?.id,
      },
    },
    select: { id: true, name: true },
  })

  return NextResponse.json(users)
}
