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
  sender: User
  receiver: User
}

export default function ChatBox() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isUserListVisible, setIsUserListVisible] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState<{ [senderId: string]: number }>({})
  const [isChatBoxMinimized, setIsChatBoxMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatBoxRef = useRef<HTMLDivElement>(null)

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

    // Düzenli olarak okunmamış mesaj sayısını güncelle
    const interval = setInterval(fetchUnreadCounts, 10000)
    return () => clearInterval(interval)
  }, [])

  // Seçilen kullanıcıya ait mesajları al
  useEffect(() => {
    if (!selectedUser) return

    fetchMessages()

    // Polling yerine WebSocket kullanılmalı
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
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

    if (!newMessage.trim() || !selectedUser) return

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, receiverId: selectedUser.id }),
      })

      setNewMessage("")
      fetchMessages()
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

  return (
    <div
      ref={chatBoxRef}
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
                    const isCurrentUser = msg.sender.id === selectedUser.id
                    return (
                      <div key={msg.id} className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isCurrentUser ? "bg-gray-100 dark:bg-zinc-700" : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="break-words text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? "text-gray-500 dark:text-gray-400" : "text-blue-100"
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
