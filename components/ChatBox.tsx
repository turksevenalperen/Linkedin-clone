"use client"

import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, X, ChevronLeft, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
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
  const [unreadCounts, setUnreadCounts] = useState<{ [senderId: string]: number }>({})
  const [isOpen, setIsOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/user/")
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  useEffect(() => {
    fetchUnreadCounts()
    const interval = setInterval(fetchUnreadCounts, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function fetchUnreadCounts() {
    const res = await fetch("/api/messages/unread-count")
    const data = await res.json()
    const map: { [senderId: string]: number } = {}
    data.forEach((item: any) => {
      map[item.senderId] = item._count._all
    })
    setUnreadCounts(map)
  }

  async function fetchMessages() {
    if (!selectedUser) return
    const res = await fetch(`/api/messages?with=${selectedUser.id}`)
    const data = await res.json()
    setMessages(data)
    markAsRead(selectedUser.id)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, receiverId: selectedUser.id }),
    })
    setNewMessage("")
    fetchMessages()
  }

  async function markAsRead(userId: string) {
    await fetch(`/api/messages/mark-read?with=${userId}`, { method: "PUT" })
    setUnreadCounts((prev) => {
      const updated = { ...prev }
      delete updated[userId]
      return updated
    })
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const formatMessageTime = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: tr })

  return (
    <>
      {/* Open button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 p-0 shadow-md"
        >
          <MessageSquare className="w-6 h-6" />
          {Object.keys(unreadCounts).length > 0 && (
            <Badge className="absolute -top-1 bg-red-400 -right-1 text-xs">{Object.values(unreadCounts).reduce((a, b) => a + b)}</Badge>
          )}
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[500px] bg-white dark:bg-zinc-800 border rounded-none md:rounded-lg shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              {selectedUser ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  <ChevronLeft />
                </Button>
              ) : (
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              )}
              <h4 className="font-semibold text-lg">
                {selectedUser ? selectedUser.name : "Mesajlar"}
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!selectedUser ? (
              <div className="p-3 space-y-2">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                    onClick={() => setSelectedUser(user)}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      {unreadCounts[user.id] && (
                        <Badge variant="destructive">{unreadCounts[user.id]}</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-3 space-y-3 overflow-y-auto h-full">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">Henüz mesaj yok</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender.id !== selectedUser.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isMe ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-zinc-700 dark:text-white"}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">{formatMessageTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          {selectedUser && (
            <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesaj yaz..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
