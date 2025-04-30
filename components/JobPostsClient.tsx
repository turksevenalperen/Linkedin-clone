// components/JobPostsClient.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import ApplicationsModal from '@/components/ApplicationsModal'

interface JobPost {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  salary?: string | null // <-- burası güncellendi
  createdAt: string
  author: {
    name?: string | null
    email: string
  }
}

export default function JobPostsClient({ initialPosts }: { initialPosts: JobPost[] }) {
  const { data: session } = useSession()
  const [jobPosts, setJobPosts] = useState(initialPosts)
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<JobPost | null>(null)
  const [selectedJobIdForApplications, setSelectedJobIdForApplications] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [editData, setEditData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
  })

  const togglePost = (id: string) => {
    setOpenPostId(prev => (prev === id ? null : id))
  }

  const applyForJob = async (jobId: string) => {
    const res = await fetch(`/api/jobpost/${jobId}/apply`, { method: 'POST' })
    if (res.ok) toast.success('Başvurunuz başarıyla alındı.')
    else {
      const data = await res.json()
      toast.error(data.error || 'Başvuru işlemi başarısız.')
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('İlanı silmek istediğine emin misin?')) return
    const res = await fetch(`/api/jobpost/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setJobPosts(prev => prev.filter(job => job.id !== id))
      toast.success('İlan başarıyla silindi.')
    } else toast.error('İlan silinemedi.')
  }

  const startEditing = (job: JobPost) => {
    setEditingPost(job)
    setEditData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: job.salary || '',
    })
  }

  const saveEdit = async () => {
    if (!editingPost) return
    const res = await fetch(`/api/jobpost/${editingPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    if (res.ok) {
      const updatedJob = await res.json()
      setJobPosts(prev => prev.map(job => (job.id === updatedJob.id ? updatedJob : job)))
      setEditingPost(null)
      toast.success('İlan başarıyla güncellendi.')
    } else toast.error('Güncelleme başarısız.')
  }

  const filteredJobs = jobPosts.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6">İş İlanları</h1>

      <input
        type="text"
        placeholder="İş ilanı başlığı ara..."
        className="border px-4 py-2 w-full mb-6 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="border rounded shadow">
            <button
              className="w-full text-left p-4 font-semibold text-xl hover:bg-gray-100"
              onClick={() => togglePost(job.id)}
            >
              {job.title}
            </button>

            <AnimatePresence>
              {openPostId === job.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t bg-gray-50">
                    {editingPost?.id === job.id ? (
                      <>
                        <input
                          type="text"
                          placeholder="Başlık"
                          className="border p-2 w-full mb-2 rounded"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        />
                        <textarea
                          placeholder="Açıklama"
                          className="border p-2 w-full mb-2 rounded"
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                        <textarea
                          placeholder="Nitelikler"
                          className="border p-2 w-full mb-2 rounded"
                          value={editData.requirements}
                          onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Konum"
                          className="border p-2 w-full mb-2 rounded"
                          value={editData.location}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Maaş (opsiyonel)"
                          className="border p-2 w-full mb-2 rounded"
                          value={editData.salary}
                          onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                        />
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700 mr-2"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                        >
                          İptal
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mt-2">{job.description}</p>
                        <p className="text-gray-500 mt-1">Nitelikler: {job.requirements}</p>
                        <p className="text-gray-500 mt-1">Konum: {job.location}</p>
                        {job.salary && <p className="text-gray-500 mt-1">Maaş: {job.salary}</p>}
                        <p className="text-sm text-gray-400 mt-2">
                          İlan Sahibi: {job.author.name || job.author.email}
                        </p>
                        <p className="text-sm text-gray-400">
                          Eklenme Tarihi: {new Date(job.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                          {session?.user?.email === job.author.email ? (
                            <>
                              <button
                                onClick={() => setSelectedJobIdForApplications(job.id)}
                                className="bg-purple-600 text-white py-1 px-4 rounded hover:bg-purple-700"
                              >
                                Başvuruları Gör
                              </button>
                              <button
                                onClick={() => startEditing(job)}
                                className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => deleteJob(job.id)}
                                className="bg-red-600 text-white py-1 px-4 rounded hover:bg-red-700"
                              >
                                Sil
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => applyForJob(job.id)}
                              className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
                            >
                              Başvur
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {selectedJobIdForApplications && (
        <ApplicationsModal
          jobId={selectedJobIdForApplications}
          onClose={() => setSelectedJobIdForApplications(null)}
        />
      )}
    </div>
  )
}
