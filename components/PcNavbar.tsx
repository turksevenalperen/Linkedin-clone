"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Moon,
  Sun,
  Home,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
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

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              LinkedIn
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Ana Sayfa</span>
            </Link>
            <Link href="/friends" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Kişiler</span>
            </Link>
          
            <Link href="/sorunsal" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Sorunsallar</span>
            </Link>
            <Link href="/job-posts" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Briefcase className="h-5 w-5" />
              <span className="text-xs mt-1">İş İlanları</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && (
              <Link href={`/profile/${user.id}`} className="hidden md:flex">
                <Avatar>
                  <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name || "Kullanıcı"} />
                  <AvatarFallback>{user.name?.charAt(0) ?? "?"}</AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
