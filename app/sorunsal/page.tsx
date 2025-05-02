// app/sorunsal/page.tsx
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function SorunsalPage() {
  const sorunsals = await prisma.sorunsal.findMany({
    include: {
      comments: true,
      author: true,
    },
    orderBy: {
      // En son yorum yapılan başlıklar en üste
      comments: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gündem Sorunsallar</h1>

      <Link href="/sorunsal/yeni" className="text-blue-600 underline">
        + Yeni Sorunsal Oluştur
      </Link>

      <ul className="mt-6 space-y-4">
        {sorunsals.map((s) => (
          <li key={s.id} className="border rounded-xl p-4 shadow bg-white">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-500">
              {s.author.name} tarafından - {s.comments.length} yorum
            </p>
            <Link href={`/sorunsal/${s.id}`} className="text-blue-500 hover:underline text-sm">
              Görüntüle →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
