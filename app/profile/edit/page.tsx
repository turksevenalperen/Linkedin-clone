"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProfileEditPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      setName(session.user.name || "");
      setPreviewImage(session.user.image || "/default-avatar.png");
    }
  }, [session, status]);

  async function handleUploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "alperen");
    formData.append("folder", "samples/ecommerce");

    const res = await fetch("https://api.cloudinary.com/v1_1/df3lrtc5r/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  }

  async function handleSaveProfile() {
    let imageUrl = previewImage;

    if (imageFile) {
      imageUrl = await handleUploadImage(imageFile);
    }

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, image: imageUrl }),
    });

    if (res.ok) {
      await update();
      alert("Profil güncellendi!");
      router.push("/dashboard");
    } else {
      alert("Bir hata oluştu");
    }
  }

  if (status === "loading") return <div className="text-center mt-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 text-black dark:text-white p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profilini Düzenle</h1>

        <div className="flex flex-col items-center mb-6">
          <Image
            src={previewImage}
            alt="Profil Fotoğrafı"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-4 text-sm"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm">İsim</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-gray-100 dark:bg-zinc-700 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Kaydet
          </button>

          <Link
            href="/dashboard"
            className="block text-center text-blue-500 text-sm mt-4 hover:underline"
          >
            Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
