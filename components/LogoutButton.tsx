"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  fullWidth?: boolean
}

export default function LogoutButton({
  variant = "outline",
  size = "default",
  className = "",
  showIcon = true,
  fullWidth = false,
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${fullWidth ? "w-full justify-start" : ""}`}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </Button>
  )
}
