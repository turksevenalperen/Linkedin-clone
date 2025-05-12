import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

const ALPEREN_ID = "cm9vponvp0000v10sa7yw6o3w"; // Alperen Türkseven's userId

export default async function DashboardServer() {
  const session = await auth();
  if (!session?.user) return <div>Giriş yapmalısın.</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user || !user.id || !user.name || !user.email) {
    return <div>Kullanıcı bilgileri eksik.</div>;
  }

  // Fetch user's friends
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: user.id, status: "accepted" },
        { recipientId: user.id, status: "accepted" },
      ],
    },
  });

  const friendIds = friendships.map((f) =>
    f.requesterId === user.id ? f.recipientId : f.requesterId
  );

  const hasNoFriends = friendIds.length === 0;

  let posts = [];

  if (hasNoFriends && user.id !== ALPEREN_ID) {
    // If no friends and user is not Alperen, fetch Alperen's posts
    posts = await prisma.post.findMany({
      where: {
        authorId: ALPEREN_ID,
      },
      include: {
        author: true,
        comments: { include: { user: true } },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Fetch posts from user's friends
    posts = await prisma.post.findMany({
      where: {
        authorId: { in: friendIds },
      },
      include: {
        author: true,
        comments: { include: { user: true } },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fetch all sorunsallar
  const sorunsallar = await prisma.sorunsal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? "",
      }}
      posts={posts}
      sorunsallar={sorunsallar}
      hasNoFriends={hasNoFriends}
    />
  );
}