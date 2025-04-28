import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function JobPostsPage() {
  const jobPosts = await prisma.jobPost.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tüm İş İlanları</h1>

      <div className="space-y-6">
        {jobPosts.map((job) => (
          <div key={job.id} className="p-6 bg-white shadow rounded-lg space-y-3">
            <h2 className="text-2xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.description}</p>
            <p className="text-gray-500 text-sm">Aranan: {job.requirements}</p>
            <p className="text-gray-500 text-sm">Lokasyon: {job.location}</p>
            {job.salary && (
              <p className="text-green-600 font-semibold">Maaş: {job.salary}</p>
            )}
            <p className="text-gray-400 text-xs">
              İlan Sahibi: {job.author?.name || "Bilinmiyor"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
