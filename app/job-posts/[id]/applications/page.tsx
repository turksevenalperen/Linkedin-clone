'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Applicant {
  name: string
  email: string
}

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch(`/api/jobpost/${id}/applications`)
        if (!res.ok) {
          throw new Error('Başvurular alınamadı')
        }
        const data = await res.json()
        setApplicants(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchApplications()
    }
  }, [id])

  if (loading) return <div>Yükleniyor...</div>
  if (error) return <div>Hata: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Başvuru Yapanlar</h1>
      {applicants.length === 0 ? (
        <p>Henüz başvuru yapan yok.</p>
      ) : (
        <ul className="space-y-2">
          {applicants.map((applicant, index) => (
            <li key={index} className="p-2 border rounded">
              <p><strong>İsim:</strong> {applicant.name}</p>
              <p><strong>Email:</strong> {applicant.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
