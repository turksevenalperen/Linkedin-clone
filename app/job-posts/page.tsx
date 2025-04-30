// app/job-posts/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import JobPostsServer from './JobPostsServer'

export default async function JobPostsPage() {
  const session = await auth()

  return <JobPostsServer />
}
