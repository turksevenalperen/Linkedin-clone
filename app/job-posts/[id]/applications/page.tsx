"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Mail, Briefcase, AlertCircle, Phone, Calendar } from "lucide-react"

interface Applicant {
  name: string
  email: string
  // Adding optional fields for enhanced UI
  resume?: string
  appliedAt?: string
  status?: "pending" | "reviewed" | "contacted" | "rejected"
}

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobTitle, setJobTitle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch(`/api/jobpost/${id}/applications`)
        if (!res.ok) {
          throw new Error("Başvurular alınamadı")
        }
        const data = await res.json()
        setApplicants(data)

        // Fetch job title
        try {
          const jobRes = await fetch(`/api/jobpost/${id}`)
          if (jobRes.ok) {
            const jobData = await jobRes.json()
            setJobTitle(jobData.title || "İş İlanı")
          }
        } catch (err) {
          console.error("İş ilanı başlığı alınamadı:", err)
        }
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <h1 className="text-2xl font-bold">{jobTitle} - Başvurular</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : applicants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
              <Briefcase className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Henüz başvuru yapan yok</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Bu iş ilanına henüz başvuru yapılmamış. Başvurular geldiğinde burada listelenecektir.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam {applicants.length} başvuru bulundu</p>
          </div>

          <div className="space-y-4">
            {applicants.map((applicant, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name)}&background=random`}
                      />
                      <AvatarFallback>{getInitials(applicant.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{applicant.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {applicant.email}
                      </CardDescription>
                    </div>
                    {applicant.status && (
                      <Badge
                        className={`ml-auto ${
                          applicant.status === "pending"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                            : applicant.status === "reviewed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              : applicant.status === "contacted"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {applicant.status === "pending" && "İncelenmedi"}
                        {applicant.status === "reviewed" && "İncelendi"}
                        {applicant.status === "contacted" && "İletişime Geçildi"}
                        {applicant.status === "rejected" && "Reddedildi"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>Başvuru {applicant.appliedAt || "Bugün"} yapıldı</span>
                    </div>
                    {applicant.resume && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Özgeçmiş Görüntüle
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="pt-4 pb-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Reddet
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                    <Mail className="mr-2 h-4 w-4" />
                    E-posta Gönder
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Phone className="mr-2 h-4 w-4" />
                    İletişime Geç
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
