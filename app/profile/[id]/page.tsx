// app/profile/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import Navbar from "@/components/PcNavbar";
export const dynamic = "force-dynamic";

export default async function UserProfilePage(context: any) {
  const { params } = context;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const userWithSerializedDates = {
    ...user,
    posts: user.posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      commentsCount: post.comments.length,
      likesCount: post.likes.length,
    })),
  };

  return (

    <div>
      <Navbar/>
    <ProfilePageClient user={userWithSerializedDates} />
  </div>
  )
  
  ;
}
