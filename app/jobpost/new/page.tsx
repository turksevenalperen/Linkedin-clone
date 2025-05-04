//joppost/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/jobpost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, requirements, location, salary }),
      credentials: "include",  // Bunu EKLEMELİSİN!

    });

    if (res.ok) {
      router.push('/jobpost'); // İş ilanları listesine yönlendir
    } else {
      alert('Bir hata oluştu.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Yeni İş İlanı Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Pozisyon (Örn: Frontend Developer)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />

        <textarea
          placeholder="İş Tanımı"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={4}
          required
        />

        <textarea
          placeholder="Aranan Kriterler"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={3}
          required
        />

        <input
          type="text"
          placeholder="Lokasyon (Örn: Eskişehir / Türkiye)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Maaş (Opsiyonel)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          İlanı Paylaş
        </button>
      </form>
    </div>
  );
}
