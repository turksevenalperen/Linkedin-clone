// app/add-job/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/jobpost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      router.push('/job-posts')
    } else {
      alert('İş ilanı eklenirken hata oluştu.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">İş İlanı Ver</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Pozisyon" value={formData.title} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="description" placeholder="İş Tanımı" value={formData.description} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="requirements" placeholder="Aranan Nitelikler" value={formData.requirements} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="location" placeholder="Konum" value={formData.location} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="salary" placeholder="Maaş (opsiyonel)" value={formData.salary} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">İlanı Ekle</button>
      </form>
    </div>
  )
}
