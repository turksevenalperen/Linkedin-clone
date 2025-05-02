// app/sorunsal/yeni/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function YeniSorunsalPage() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/sorunsal', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      router.push('/sorunsal');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Yeni Sorunsal Oluştur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Sorunsal başlığı..."
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Gönder
        </button>
      </form>
    </div>
  );
}
