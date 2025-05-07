"use client"

import type React from "react"
import ChatBox from "./ChatBox"


import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Moon,
  Sun,
  Home,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  Menu,
  X,
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Plus,
  ImageIcon,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import EditProfileModal from "@/components/EditProfileModal"
import LogoutButton from "@/components/LogoutButton"

interface Sorunsal {
  id: string
  title: string
}

interface Props {
  user: {
    name: string
    email: string
    image: string
  }
  posts: any[]
  sorunsallar: Sorunsal[]
}

export default function DashboardClient({ user, posts: initialPosts, sorunsallar }: Props) {
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [posts, setPosts] = useState(initialPosts)
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
  const [darkMode, setDarkMode] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if dark mode preference is stored
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    // Apply dark mode class to document
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  async function handleUploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "alperen")
    formData.append("folder", "samples/ecommerce")

    const res = await fetch("https://api.cloudinary.com/v1_1/df3lrtc5r/image/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    return data.secure_url
  }

  async function fetchPosts() {
    const res = await fetch("/api/posts", { cache: "no-store" })
    const data = await res.json()
    setPosts(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let imageUrl = ""

    if (imageFile) {
      imageUrl = await handleUploadImage(imageFile)
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
    })

    if (res.ok) {
      setContent("")
      setImageFile(null)
      setPreviewImage(null)
      fetchPosts()
    }
  }

  async function toggleLike(postId: string) {
    const res = await fetch("/api/posts/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    })
    if (res.ok) fetchPosts()
  }

  async function deletePost(postId: string) {
    if (!confirm("Bu gönderiyi silmek istediğine emin misin?")) return

    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    })

    if (res.ok) fetchPosts()
  }

  async function submitComment(postId: string) {
    const content = commentInputs[postId]
    if (!content || content.trim() === "") return

    const res = await fetch("/api/posts/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content }),
    })
    if (res.ok) {
      setCommentInputs({ ...commentInputs, [postId]: "" })
      fetchPosts()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewImage(null)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-zinc-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    LinkedIn
                  </span>
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="/"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">Ana Sayfa</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs mt-1">Kişiler</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs mt-1">Makaleler</span>
                </a>
                <a
                  href="/sorunsal"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs mt-1">Sorunsallar</span>
                </a>
                <a
                  href="/job-posts"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="text-xs mt-1">İş İlanları</span>
                </a>
              </nav>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <Avatar className="hidden md:flex">
                  <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-zinc-900 pt-16">
            <div className="p-4 space-y-6">
              <div className="flex items-center space-x-3 p-2">
                <Avatar>
                  <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              <Separator />

              <nav className="space-y-4">
                <a
                  href="/"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Home className="h-5 w-5" />
                  <span>Ana Sayfa</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Users className="h-5 w-5" />
                  <span>Kişiler</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Makaleler</span>
                </a>
                <a
                  href="/sorunsal"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Sorunsallar</span>
                </a>
                <a
                  href="/job-posts"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>İş İlanları</span>
                </a>
              </nav>

              <Separator />

              <div className="space-y-3">
                <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="w-full justify-start">
                  <span>Profili Düzenle</span>
                </Button>

                <LogoutButton variant="destructive" fullWidth />

                <Button
                  onClick={() => router.push("/add-job/")}
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  <span>İş İlanı Ver</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Sidebar - Profile */}
            <div className="hidden md:block space-y-4">
              <Card>
                <CardHeader className="pb-2 pt-6 flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-2">
                    <Avatar className="w-20 h-20 border-4 border-white dark:border-zinc-800">
                      <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-xl font-semibold text-center">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{user.email}</p>
                </CardHeader>
                <CardContent className="text-center pb-2">
                 
                
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-2 pb-6">
                  <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm" className="w-full">
                    Profili Düzenle
                  </Button>
                  <LogoutButton
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  />
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button onClick={() => router.push("/add-job/")} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    İş İlanı Ver
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              {/* Post Creation Card */}
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Textarea
                        placeholder="Ne düşünüyorsun?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 resize-none focus-visible:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    {previewImage && (
                      <div className="relative mt-2 rounded-lg overflow-hidden">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-auto max-h-60 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          title="Remove image preview"
                          onClick={() => {
                            setPreviewImage(null)
                            setImageFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Fotoğraf
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        disabled={!content.trim() && !imageFile}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Paylaş
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Posts */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      {post.author && (
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={post.author.image || "/default-avatar.png"}
                              alt={post.author.name || "Kullanıcı"}
                            />
                            <AvatarFallback>{(post.author.name || "K").charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                          </div>

                          {post.author && post.author.email === user.email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePost(post.id)}
                              className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Sil</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pb-3">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-4">{post.content}</p>

                      {post.imageUrl && (
                        <div className="mt-3 -mx-6">
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt="Post görseli"
                            width={600}
                            height={400}
                            className="w-full object-cover max-h-[500px]"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          {post.likes?.length > 0 && (
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 text-red-500 mr-1 fill-red-500" />
                              {post.likes.length} beğeni
                            </span>
                          )}
                        </div>
                        <div>{post.comments?.length > 0 && <span>{post.comments.length} yorum</span>}</div>
                      </div>
                    </CardContent>

                    <Separator />

                    <CardFooter className="flex justify-between py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`flex-1 ${
                          post.likes?.some((like: any) => like.userId === user.email)
                            ? "text-red-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            post.likes?.some((like: any) => like.userId === user.email) ? "fill-red-500" : ""
                          }`}
                        />
                        Beğen
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-gray-600 dark:text-gray-300"
                        onClick={() => {
                          const el = document.getElementById(`comment-input-${post.id}`)
                          if (el) el.focus()
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Yorum Yap
                      </Button>
                    </CardFooter>

                    {/* Comments */}
                    {post.comments?.length > 0 && (
                      <div className="px-6 py-2 bg-gray-50 dark:bg-zinc-800/50">
                        {post.comments.map((comment: any) => (
                          <div key={comment.id} className="py-3 flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={comment.user?.image || "/default-avatar.png"}
                                alt={comment.user?.name || "Kullanıcı"}
                              />
                              <AvatarFallback>{(comment.user?.name || "K").charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-2">
                                <p className="font-medium text-sm">{comment.user?.name || "Kullanıcı"}</p>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-zinc-800/50 flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center">
                        <Input
                          id={`comment-input-${post.id}`}
                          placeholder="Yorum yaz..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          className="flex-1 bg-white dark:bg-zinc-900 border-0 focus-visible:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              submitComment(post.id)
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => submitComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="ml-2"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Gönder</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Gündem Sorunsallar</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {sorunsallar.slice(0, 5).map((s) => (
                      <li key={s.id}>
                        <a href={`/sorunsal/${s.id}`} className="flex items-center justify-between group">
                          <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline line-clamp-1">
                            {s.title}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </a>
                      </li>
                    ))}
                  </ul>

                  {sorunsallar.length > 5 && (
                    <a
                      href="/sorunsal"
                      className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      Tümünü Gör
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Önerilen Bağlantılar</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Kullanıcı {i}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Yazılım Geliştirici</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Bağlan
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 z-40">
          <div className="flex justify-around items-center h-16">
            <a
              href="/"
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Ana Sayfa</span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Kişiler</span>
            </a>
            <a href="/add-job/" className="flex flex-col items-center text-green-600 dark:text-green-400">
              <Plus className="h-6 w-6 p-1 bg-green-100 dark:bg-green-900/30 rounded-full" />
              <span className="text-xs mt-1">İlan Ver</span>
            </a>
            <a
              href="/sorunsal"
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Sorunsallar</span>
            </a>
            <a
              href="/job-posts"
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs mt-1">İş İlanları</span>
            </a>
          </div>
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <ChatBox /> 
    </div>
  )
}
