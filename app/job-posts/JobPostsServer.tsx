import { prisma } from "@/lib/prisma"
import JobPostsClient from "@/components/JobPostsClient"

export default async function JobPostsServer() {
  const jobPosts = (
    await prisma.jobPost.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  ).map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }))

  return <JobPostsClient initialPosts={jobPosts} />
}
