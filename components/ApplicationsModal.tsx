'use client'

import { useEffect, useState } from 'react'

interface Applicant {
  name: string | null
  email: string
}

interface ApplicationsModalProps {
  jobId: string
  onClose: () => void
}

export default function ApplicationsModal({ jobId, onClose }: ApplicationsModalProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch(`/api/jobpost/${jobId}/applications`)
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

    if (jobId) {
      fetchApplicants()
    }
  }, [jobId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">Başvuru Yapanlar</h2>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-500">Hata: {error}</p>
        ) : applicants.length === 0 ? (
          <p>Henüz başvuru yapan yok.</p>
        ) : (
          <ul className="space-y-2">
            {applicants.map((applicant, index) => (
              <li key={index} className="border p-2 rounded">
                <p><strong>İsim:</strong> {applicant.name || 'İsim yok'}</p>
                <p><strong>Email:</strong> {applicant.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
