"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { data: session, update } = useSession()
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState("/default-avatar.png")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setPreviewImage(session.user.image || "/default-avatar.png")
    }
  }, [session])

  if (!isOpen) return null

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

  async function handleSaveProfile() {
    let imageUrl = previewImage

    if (imageFile) {
      imageUrl = await handleUploadImage(imageFile)
    }

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: imageUrl }),
    })

    if (res.ok) {
      await update({
        name: name,
        image: imageUrl,
      })

      alert("Profil güncellendi!")
      onClose()
    } else {
      alert("Bir hata oluştu")
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-80 space-y-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-xl font-bold text-center">Profili Düzenle</h2>
        <div className="flex flex-col items-center">
          <Image
            src={previewImage || "/placeholder.svg"}
            alt="Profil Fotoğrafı"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0])
                setPreviewImage(URL.createObjectURL(e.target.files[0]))
              }
            }}
            className="mt-2 text-xs"
          />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white"
          placeholder="İsim"
        />
        <button
          onClick={handleSaveProfile}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Kaydet
        </button>

        
      </div>
    </div>
  )
}
