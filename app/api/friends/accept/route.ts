import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { requesterId } = await req.json();

  await prisma.friendship.updateMany({
    where: {
      requesterId,
      recipientId: currentUser.id,
    },
    data: {
      status: "accepted",
    },
  });

  return NextResponse.json({ success: true });
}
