import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, action } = await req.json()

  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  await prisma.friendship.update({
    where: { id },
    data: {
      status: action === "accept" ? "accepted" : "rejected",
    },
  })

  return NextResponse.json({ success: true })
}
