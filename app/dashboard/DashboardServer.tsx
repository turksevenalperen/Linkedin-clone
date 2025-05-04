import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import DashboardClient from "@/components/DashboardClient"

export default async function DashboardServer() {
  const session = await auth()
  if (!session || !session.user) return <div>Giriş yapmalısın.</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user || !user.name || !user.email || !user.image) {
    return <div>Kullanıcı bilgileri eksik.</div>
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: { include: { user: true } },
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const sorunsallar = await prisma.sorunsal.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardClient
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      posts={posts}
      sorunsallar={sorunsallar}
    />
  )
}
