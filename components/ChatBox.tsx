"use client"

import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
}

interface Message {
  id: string
  content: string
  createdAt: string
  sender: User
  receiver: User
}

export default function ChatBox() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isUserListVisible, setIsUserListVisible] = useState(false) // Kullanıcı listesi görünürlüğü
  const [unreadCounts, setUnreadCounts] = useState<{ [senderId: string]: number }>({})

  // Kullanıcıları çekme
  useEffect(() => {
    fetch("/api/user/")
      .then(res => res.json())
      .then(setUsers)
  }, [])

  // Okunmamış mesaj sayısını çekme (tüm kullanıcılar için)
  useEffect(() => {
    fetch("/api/messages/unread-count")
      .then(res => res.json())
      .then(data => {
        const map: { [senderId: string]: number } = {}
        data.forEach((item: any) => {
          map[item.senderId] = item._count._all
        })
        setUnreadCounts(map)
      })
  }, [])

  // Seçilen kullanıcıya ait mesajları al
  useEffect(() => {
    const interval = setInterval(fetchMessages, 3000)
    fetchMessages()
    return () => clearInterval(interval)
  }, [selectedUser])

  // Seçilen kullanıcıya ait mesajları al
  async function fetchMessages() {
    if (!selectedUser) return
    const res = await fetch(`/api/messages?with=${selectedUser.id}`)
    const data = await res.json()
    setMessages(data)
  }

  // Yeni mesaj gönderme
  async function sendMessage() {
    if (!newMessage.trim() || !selectedUser) return
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, receiverId: selectedUser.id }),
    })
    setNewMessage("")
    fetchMessages()
  }

  // Kullanıcı listesinin görünürlüğünü kontrol et
  function toggleUserListVisibility() {
    setIsUserListVisible(!isUserListVisible)
  }

  // Kullanıcıya tıklayınca mesajları okundu olarak işaretle
  async function markAsRead(userId: string) {
    await fetch(`/api/messages/mark-read?with=${userId}`, {
      method: "PUT",
    })
    setUnreadCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts }
      delete updatedCounts[userId]  // Seçilen kullanıcı için okunmamış sayıyı kaldır
      return updatedCounts
    })
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg p-3 z-50">
      <h4 className="font-bold mb-2">Mesaj Gönder</h4>

      {/* Başlangıçta seçili kişi yalnızca bir kullanıcı olmalı */}
      <div className="mb-2">
        <p className="text-sm font-semibold">Kime:</p>
        {selectedUser ? (
          <div className="flex items-center">
            <span className="text-lg font-semibold">{selectedUser.name}</span>
            <button
              onClick={() => setSelectedUser(null)}
              className="ml-2 text-sm text-blue-500"
            >
              Kişiyi Değiştir
            </button>
          </div>
        ) : (
          <button
            onClick={toggleUserListVisibility} // Listeyi açma butonu
            className="w-full px-2 py-1 rounded bg-blue-500 text-white mb-2"
          >
            Yeni Mesaj Gönder
          </button>
        )}

        {/* Tüm kullanıcıları gösterme butonu */}
        {isUserListVisible && (
          <div className="space-y-1 mt-2">
            {users.map(user => {
              const unreadCount = unreadCounts[user.id] || 0
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user)
                    markAsRead(user.id) // Mesajları okundu olarak işaretle
                    setIsUserListVisible(false) // Listeyi kapat
                  }}
                  className={`block w-full text-left px-2 py-1 rounded ${selectedUser?.id === user.id ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                >
                  {user.name} {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Mesajlar */}
      <div className="max-h-64 overflow-y-auto space-y-1 text-sm mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="break-words">
            <strong>{msg.sender.name}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* Mesaj gönderme */}
      {selectedUser && (
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj..."
            className="flex-1 px-2 py-1 rounded border text-black dark:text-white dark:bg-zinc-700"
          />
          <button
            onClick={sendMessage}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Gönder
          </button>
        </div>
      )}
    </div>
  )
}
