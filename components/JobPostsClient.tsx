"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Briefcase, MapPin, Calendar, Search, Edit, Trash2, Users, ChevronDown, ChevronUp, DollarSign, FileText, CheckCircle } from 'lucide-react'
import ApplicationsModal from "@/components/ApplicationsModal"

interface JobPost {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  salary?: string | null
  createdAt: string
  author: {
    name?: string | null
    email: string
    image?: string | null
  }
}

export default function JobPostsClient({ initialPosts }: { initialPosts: JobPost[] }) {
  const { data: session } = useSession()
  const [jobPosts, setJobPosts] = useState(initialPosts)
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<JobPost | null>(null)
  const [selectedJobIdForApplications, setSelectedJobIdForApplications] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  })

  const togglePost = (id: string) => {
    setOpenPostId((prev) => (prev === id ? null : id))
  }

  const applyForJob = async (jobId: string) => {
    const res = await fetch(`/api/jobpost/${jobId}/apply`, { method: "POST" })
    if (res.ok) toast.success("Başvurunuz başarıyla alındı.")
    else {
      const data = await res.json()
      toast.error(data.error || "Başvuru işlemi başarısız.")
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm("İlanı silmek istediğine emin misin?")) return
    const res = await fetch(`/api/jobpost/${id}`, { method: "DELETE" })
    if (res.ok) {
      setJobPosts((prev) => prev.filter((job) => job.id !== id))
      toast.success("İlan başarıyla silindi.")
    } else toast.error("İlan silinemedi.")
  }

  const startEditing = (job: JobPost) => {
    setEditingPost(job)
    setEditData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: job.salary || "",
    })
  }

  const saveEdit = async () => {
    if (!editingPost) return
    const res = await fetch(`/api/jobpost/${editingPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
    if (res.ok) {
      const updatedJob = await res.json()
      setJobPosts((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
      setEditingPost(null)
      toast.success("İlan başarıyla güncellendi.")
    } else toast.error("Güncelleme başarısız.")
  }

  const filteredJobs = jobPosts.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">İş İlanları</h1>
          <p className="text-gray-500 dark:text-gray-400">Kariyerinize uygun iş fırsatlarını keşfedin</p>
        </div>
        <Button onClick={() => router.push("/add-job")} className="bg-blue-600 hover:bg-blue-700">
          <Briefcase className="mr-2 h-4 w-4" />
          Yeni İlan Oluştur
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="İş ilanı başlığı ara..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">İlan bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Arama kriterlerinize uygun iş ilanı bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <button
                  className="w-full text-left flex items-center justify-between"
                  onClick={() => togglePost(job.id)}
                >
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  {openPostId === job.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(job.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={job.author.image || undefined} />
                      <AvatarFallback className="text-xs">{getInitials(job.author.name)}</AvatarFallback>
                    </Avatar>
                    {job.author.name || job.author.email}
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {openPostId === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Separator />
                    <CardContent className="pt-4">
                      {editingPost?.id === job.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Başlık</label>
                            <Input
                              type="text"
                              placeholder="Başlık"
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Açıklama</label>
                            <Textarea
                              placeholder="Açıklama"
                              rows={4}
                              value={editData.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Nitelikler</label>
                            <Textarea
                              placeholder="Nitelikler"
                              rows={3}
                              value={editData.requirements}
                              onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Konum</label>
                              <Input
                                type="text"
                                placeholder="Konum"
                                value={editData.location}
                                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Maaş (opsiyonel)</label>
                              <Input
                                type="text"
                                placeholder="Maaş (opsiyonel)"
                                value={editData.salary}
                                onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Kaydet
                            </Button>
                            <Button variant="outline" onClick={() => setEditingPost(null)}>
                              İptal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              <FileText className="mr-1 h-3 w-3" />
                              İş Tanımı
                            </Badge>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
                          </div>

                          <div>
                            <Badge variant="outline" className="mb-2">
                              <Users className="mr-1 h-3 w-3" />
                              Aranan Nitelikler
                            </Badge>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.requirements}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-4">
                            {session?.user?.email === job.author.email ? (
                              <>
                                <Button
                                  onClick={() => setSelectedJobIdForApplications(job.id)}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Başvuruları Gör
                                </Button>
                                <Button onClick={() => startEditing(job)} className="bg-blue-600 hover:bg-blue-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Düzenle
                                </Button>
                                <Button
                                  onClick={() => deleteJob(job.id)}
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Sil
                                </Button>
                              </>
                            ) : (
                              <Button onClick={() => applyForJob(job.id)} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Başvur
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </div>

      {selectedJobIdForApplications && (
        <ApplicationsModal jobId={selectedJobIdForApplications} onClose={() => setSelectedJobIdForApplications(null)} />
      )}
    </div>
  )
}
