import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Plus, ChevronRight, TrendingUp, Clock } from 'lucide-react'

export default async function SorunsalPage() {
  const sorunsals = await prisma.sorunsal.findMany({
    include: {
      comments: true,
      author: true,
    },
    orderBy: {
      // En son yorum yapılan başlıklar en üste
      comments: {
        _count: "desc",
      },
    },
    take: 10,
  })

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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gündem Sorunsallar</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Topluluğun tartıştığı güncel konular ve sorunlar
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/sorunsal/yeni">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sorunsal Oluştur
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sorunsals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Henüz sorunsal yok</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                İlk sorunsalı oluşturarak tartışmayı başlatabilirsiniz.
              </p>
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Link href="/sorunsal/yeni">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Sorunsal Oluştur
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          sorunsals.map((s) => (
            <Card key={s.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={s.author.image || undefined} />
                        <AvatarFallback className="text-xs">{getInitials(s.author.name)}</AvatarFallback>
                      </Avatar>
                      {s.author.name} tarafından {formatDate(s.createdAt.toString())}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {s.comments.length} yorum
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 pb-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {s.comments.length > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 mr-1" />
                  )}
                  {s.comments.length > 0 ? "Aktif tartışma" : "Yeni başlık"}
                </div>
                <Button asChild variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                  <Link href={`/sorunsal/${s.id}`}>
                    Görüntüle
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
