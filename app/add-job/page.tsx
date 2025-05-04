"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, MapPin, FileText, Users, DollarSign, CheckCircle } from "lucide-react"

export default function AddJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/jobpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("İş ilanı başarıyla eklendi")
        setTimeout(() => {
          router.push("/job-posts")
        }, 1000)
      } else {
        const data = await res.json()
        toast.error(data.error || "İş ilanı eklenirken hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Toaster position="top-right" />

      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <h1 className="text-2xl font-bold">İş İlanı Oluştur</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni İş İlanı</CardTitle>
          <CardDescription>
            Şirketiniz için yeni bir iş ilanı oluşturun. Detaylı bilgiler daha fazla başvuru almanızı sağlar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                Pozisyon Başlığı <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Örn: Senior Frontend Geliştirici"
                value={formData.title}
                onChange={handleChange}
                required
                className="focus-visible:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Açık pozisyonun tam adını yazın. Bu, ilanınızın başlığı olacaktır.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                İş Tanımı <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Pozisyonun sorumlulukları ve görevleri hakkında detaylı bilgi verin..."
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[120px] focus-visible:ring-blue-500"
              />
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                  Pozisyonun günlük görevleri, sorumlulukları ve beklentileri hakkında bilgi verin.
                </p>
                <p className="text-xs text-gray-500">{formData.description.length}/1000 karakter</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                Aranan Nitelikler <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Adaylarda aradığınız beceriler, deneyim ve eğitim gereksinimleri..."
                value={formData.requirements}
                onChange={handleChange}
                required
                className="min-h-[120px] focus-visible:ring-blue-500"
              />
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                  Adaylarda aradığınız temel ve tercih edilen nitelikleri belirtin.
                </p>
                <p className="text-xs text-gray-500">{formData.requirements.length}/1000 karakter</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Konum <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Örn: İstanbul, Uzaktan"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="focus-visible:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">İşin yapılacağı şehir veya uzaktan çalışma durumu</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Maaş Aralığı <span className="text-gray-400 text-xs ml-1">(Opsiyonel)</span>
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="Örn: 20.000₺ - 30.000₺"
                  value={formData.salary}
                  onChange={handleChange}
                  className="focus-visible:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maaş bilgisi paylaşmak daha fazla başvuru almanızı sağlayabilir
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  İlan Ekleniyor...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  İlanı Yayınla
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        İlanınız yayınlandıktan sonra düzenleyebilir veya kaldırabilirsiniz.
      </div>
    </div>
  )
}
