"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import Link from "next/link"
import { Toaster, toast } from "sonner"

export default function YeniSorunsalPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/sorunsal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })

      if (res.ok) {
        toast.success("Sorunsal başarıyla oluşturuldu")
        setTimeout(() => {
          router.push("/sorunsal")
        }, 1000)
      } else {
        const error = await res.json()
        toast.error(error.message || "Bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Toaster position="top-right" />

      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/sorunsal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sorunsallara Dön
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-2">Yeni Sorunsal Oluştur</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Topluluğun tartışmasını istediğiniz bir konu veya sorun hakkında yeni bir başlık oluşturun.
        </p>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Sorunsal Detayları</CardTitle>
              <CardDescription>
                Başlığınızı ve açıklamanızı girin. Net ve açıklayıcı bir başlık daha fazla yanıt almanızı sağlar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  Başlık <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Sorunsal başlığı..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="focus-visible:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kısa ve açıklayıcı bir başlık yazın (örn: "Yazılım geliştirmede test süreçleri nasıl iyileştirilir?")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  Açıklama <span className="text-gray-400 text-xs ml-1">(Opsiyonel)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Sorunsalınızı detaylandırın..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] focus-visible:ring-blue-500"
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">
                    Sorunsalınızı daha detaylı açıklayın. Bu, daha iyi yanıtlar almanıza yardımcı olur.
                  </p>
                  <p className="text-xs text-gray-500">{description.length}/1000 karakter</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" type="button" asChild>
                <Link href="/sorunsal">İptal</Link>
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
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Sorunsal Oluştur
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
