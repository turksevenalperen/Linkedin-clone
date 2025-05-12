"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  currentUserId: string
}

type User = {
  id: string
  name: string | null
  email: string
  image?: string | null
}

export default function FriendList({ currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [sending, setSending] = useState<string | null>(null)
  const [sentIds, setSentIds] = useState<string[]>([])

  useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("/api/user")
    const data = await res.json()
    console.log(data) // BURAYI EKLE
    setUsers(data)
  }
  fetchUsers()
}, [])

  const sendRequest = async (recipientId: string) => {
    setSending(recipientId)
    const res = await fetch("/api/friends/send", {
      method: "POST",
      body: JSON.stringify({ recipientId }),
    })

    if (res.ok) {
      setSentIds([...sentIds, recipientId])
    }

    setSending(null)
  }

  return (
    <div className="space-y-2">
      {users
        .filter((u) => u.id !== currentUserId)
        .map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center border p-2 rounded"
          >
             <Link href={`/profile/${user.id}`}>
            <div className="flex items-center space-x-2">
             
                <Avatar className="cursor-pointer">
                <AvatarImage src={user.image || "/default-avatar.png"} />
                  <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
              
              <div>
                <p>{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            </Link>
            <button
              onClick={() => sendRequest(user.id)}
              disabled={sending === user.id || sentIds.includes(user.id)}
              className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
            >
              {sentIds.includes(user.id)
                ? "İstek Gönderildi"
                : sending === user.id
                ? "Gönderiliyor..."
                : "Arkadaş Ekle"}
            </button>
          </div>
        ))}
    </div>
  )
}