"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Request = {
  id: string
  requester: {
    id: string
    name: string | null
    email: string
    image?: string | null
  }
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<Request[]>([])

  const fetchRequests = async () => {
    const res = await fetch("/api/friends/requests")
    const data = await res.json()
    setRequests(data)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const respondToRequest = async (id: string, action: "accept" | "reject") => {
    await fetch(`/api/friends/respond`, {
      method: "POST",
      body: JSON.stringify({ id, action }),
    })
    fetchRequests() // refresh
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 && <p>Bekleyen arkadaşlık isteği yok.</p>}
      {requests.map((req) => (
        <div key={req.id} className="flex justify-between items-center border p-2 rounded">
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${req.requester.id}`}>
              <Avatar className="cursor-pointer">
                <AvatarImage 
                  src={req.requester.image || "/default-avatar.png"} 
                  alt={req.requester.name || ""} 
                />
                <AvatarFallback>{req.requester.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <p className="font-medium">{req.requester.name}</p>
              <p className="text-sm text-gray-500">{req.requester.email}</p>
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => respondToRequest(req.id, "accept")}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Kabul Et
            </button>
            <button
              onClick={() => respondToRequest(req.id, "reject")}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Reddet
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}