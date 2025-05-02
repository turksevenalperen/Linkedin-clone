'use client';

import { useState } from 'react';

export default function YorumForm({ sorunsalId }: { sorunsalId: string }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/sorunsal/comment', {
      method: 'POST',
      body: JSON.stringify({ content, sorunsalId }),
    });

    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Yorum yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Yorum Yap
      </button>
    </form>
  );
}
