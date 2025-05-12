"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Home,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  X,
  Menu,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import LogoutButton from "@/components/LogoutButton"

export default function MobileMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!user) return null // kullanıcı yoksa menüyü gösterme

  return (
    <>
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
     
     
      
    </>
  )
}
