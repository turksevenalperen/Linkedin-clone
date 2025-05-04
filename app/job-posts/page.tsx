import { auth } from "@/auth"
import JobPostsServer from "./JobPostsServer"

export default async function JobPostsPage() {
  const session = await auth()

  return <JobPostsServer />
}
