import { prisma } from '@/lib/prisma';
import YorumForm from '@/components/YorumForm';
import { type Metadata } from 'next';

interface SorunsalDetailPageProps {
  params: { id: string };
}

export default async function SorunsalDetail({ params }: SorunsalDetailPageProps) {
  const sorunsal = await prisma.sorunsal.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
    },
  });

  if (!sorunsal) return <div>Sorunsal bulunamadı</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{sorunsal.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{sorunsal.author.name}</p>

      <YorumForm sorunsalId={sorunsal.id} />

      <ul className="mt-6 space-y-2">
        {sorunsal.comments.map((c) => (
          <li key={c.id} className="border p-2 rounded text-sm">
            <strong>{c.user.name}:</strong> {c.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
