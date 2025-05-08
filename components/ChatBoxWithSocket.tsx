"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { tr } from "date-fns/locale"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

interface User {
  id: string
  name: string
  image?: string | null
}

interface Message {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  senderId: string
  receiverId: string
  sender: User
  receiver: User
}

export default function ChatBoxWithSocket() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCounts, setUnreadCounts] = useState<{ [senderId: string]: number }>({})
  const [isChatBoxMinimized, setIsChatBoxMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // Socket.io bağlantısı
  useEffect(() => {
    if (!session?.user?.id) return

    // Socket.io sunucusuna bağlan
    fetch("/api/socket")

    socketRef.current = io()

    // Kullanıcı kimliğini socket sunucusuna gönder
    socketRef.current.emit("join", session.user.id)

    // Yeni mesaj dinle
    socketRef.current.on("receive_message", (message: Message) => {
      if (selectedUser && message.senderId === selectedUser.id) {
        // Seçili kullanıcıdan gelen mesajı ekle
        setMessages((prev) => [...prev, message])
        // Mesajı okundu olarak işaretle
        markMessageAsRead(message.id)
      } else {
        // Okunmamış mesaj sayısını güncelle
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }))
      }
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [session, selectedUser])

  // Kullanıcıları çekme
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user/")
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata:", error)
      }
    }

    fetchUsers()
  }, [])

  // Okunmamış mesaj sayısını çekme
  useEffect(() => {
    async function fetchUnreadCounts() {
      try {
        const res = await fetch("/api/messages/unread-count")
        const data = await res.json()

        const map: { [senderId: string]: number } = {}
        data.forEach((item: any) => {
          map[item.senderId] = item._count._all
        })

        setUnreadCounts(map)
      } catch (error) {
        console.error("Okunmamış mesaj sayısı alınırken hata:", error)
      }
    }

    fetchUnreadCounts()
  }, [])

  // Seçilen kullanıcıya ait mesajları al
  useEffect(() => {
    if (!selectedUser) return

    fetchMessages()
  }, [selectedUser])

  // Mesajlar yüklendiğinde otomatik olarak en alta kaydır
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mesajları en alta kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Seçilen kullanıcıya ait mesajları al
  async function fetchMessages() {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/messages?with=${selectedUser.id}`)
      if (!res.ok) throw new Error("Mesajlar alınamadı")

      const data = await res.json()
      setMessages(data)

      // Mesajları okundu olarak işaretle
      markAsRead(selectedUser.id)
    } catch (error) {
      console.error("Mesajlar alınırken hata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Yeni mesaj gönderme
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!newMessage.trim() || !selectedUser || !session?.user?.id) return

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, receiverId: selectedUser.id }),
      })

      const message = await res.json()

      // Mesajı socket üzerinden gönder
      if (socketRef.current) {
        socketRef.current.emit("new_message", message)
      }

      // Mesajı yerel olarak ekle
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error)
    }
  }

  // Kullanıcıya tıklayınca mesajları okundu olarak işaretle
  async function markAsRead(userId: string) {
    try {
      await fetch(`/api/messages/mark-read?with=${userId}`, {
        method: "PUT",
      })

      setUnreadCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts }
        delete updatedCounts[userId]
        return updatedCounts
      })
    } catch (error) {
      console.error("Mesajlar okundu işaretlenirken hata:", error)
    }
  }

  // Tek bir mesajı okundu olarak işaretle
  async function markMessageAsRead(messageId: string) {
    try {
      await fetch(`/api/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      })
    } catch (error) {
      console.error("Mesaj okundu işaretlenirken hata:", error)
    }
  }

  // Toplam okunmamış mesaj sayısı
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)

  // Kullanıcı adının baş harflerini al
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Mesaj zamanını formatla
  const formatMessageTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: tr })
  }

  if (!session) return null

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 md:w-96 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg z-50 transition-all duration-300 ${
        isChatBoxMinimized ? "h-14" : "max-h-[500px]"
      }`}
    >
      {/* Başlık */}
      <div
        className="flex items-center justify-between p-3 border-b cursor-pointer"
        onClick={() => setIsChatBoxMinimized(!isChatBoxMinimized)}
      >
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <h4 className="font-bold">
            {selectedUser ? selectedUser.name : "Mesajlar"}
            {totalUnreadCount > 0 && !selectedUser && (
              <Badge variant="destructive" className="ml-2">
                {totalUnreadCount}
              </Badge>
            )}
          </h4>
        </div>
        <div className="flex items-center">
          {isChatBoxMinimized ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <>
              {selectedUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUser(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <ChevronDown className="h-5 w-5" />
            </>
          )}
        </div>
      </div>

      {!isChatBoxMinimized && (
        <>
          {/* Kullanıcı seçimi veya mesaj listesi */}
          {!selectedUser ? (
            <div className="p-3 overflow-y-auto max-h-[400px]">
              {users.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Kullanıcılar yükleniyor...</p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => {
                    // Kendi kullanıcımızı listeden çıkar
                    if (session?.user?.id && user.id === session.user.id) return null

                    const unreadCount = unreadCounts[user.id] || 0
                    return (
                      <Card
                        key={user.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700"
                        onClick={() => {
                          setSelectedUser(user)
                          markAsRead(user.id)
                        }}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={user.image || undefined} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Mesajlar */}
              <div className="p-3 overflow-y-auto h-[300px] space-y-3">
                {isLoading && messages.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">Mesajlar yükleniyor...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Henüz mesaj yok. Bir mesaj göndererek sohbete başlayın.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = session?.user?.id && msg.senderId === session.user.id
                    return (
                      <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-zinc-700"
                          }`}
                        >
                          <p className="break-words text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Mesaj gönderme */}
              <div className="p-3 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
