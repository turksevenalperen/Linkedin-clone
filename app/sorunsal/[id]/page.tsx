import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import YorumForm from "@/components/YorumForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, Calendar, User } from 'lucide-react'
import Link from "next/link"

export default async function SorunsalDetail(context: any) {
  const { params } = context
  const session = await auth()

  const sorunsal = await prisma.sorunsal.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  })

  if (!sorunsal) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
              <MessageSquare className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Sorunsal bulunamadı</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Aradığınız sorunsal bulunamadı veya kaldırılmış olabilir.
            </p>
            <Button asChild className="mt-4">
              <Link href="/sorunsal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sorunsallara Dön
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/sorunsal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Sorunsallar
          </Link>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{sorunsal.title}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={sorunsal.author.image || undefined} />
                    <AvatarFallback>{getInitials(sorunsal.author.name)}</AvatarFallback>
                  </Avatar>
                  <span className="mr-2">{sorunsal.author.name}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(sorunsal.createdAt.toString())}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                {sorunsal.comments.length} yorum
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Yorumunuzu Ekleyin</CardTitle>
          </CardHeader>
          <CardContent>
            <YorumForm sorunsalId={sorunsal.id} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Yorumlar ({sorunsal.comments.length})
          </h2>

          {sorunsal.comments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sorunsal.comments.map((comment) => (
                <Card key={comment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={comment.user.image || undefined} />
                        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt.toString())}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
