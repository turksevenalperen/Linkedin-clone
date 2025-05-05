"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { signIn } from "next-auth/react"
import { Github, User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const data = await res.json()
        setError(data.message || "Kayıt başarısız")
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = () => {
    setSocialLoading("github")
    signIn("github", { callbackUrl: "/dashboard" })
  }

  const handleGoogleSignIn = () => {
    setSocialLoading("google")
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          >
            LinkedIn
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Hesap Oluştur</CardTitle>
            <CardDescription className="text-center">Profesyonel ağınızı genişletmek için kayıt olun</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="text-sm py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900 text-sm py-2">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">İsim</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  En az 8 karakter, bir büyük harf ve bir rakam içermelidir
                </p>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || success}>
                {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">veya şununla devam et</span>
              </div>
            </div>

            <div className="grid grid-cols gap-3">
              <Button variant="outline" onClick={handleGithubSignIn} type="button" disabled={socialLoading !== null}>
                <Github className="mr-2 h-4 w-4" />
                {socialLoading === "github" ? "Yükleniyor..." : "Github"}
              </Button>
             
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Giriş Yap
              </Link>
            </div>
            <Button variant="link" asChild className="px-0">
              <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm">
                Ana Sayfaya Dön
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Kayıt olarak, LinkedIn'in{" "}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Kullanım Koşulları
          </Link>
          ,{" "}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Gizlilik Politikası
          </Link>{" "}
          ve{" "}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Çerez Politikası
          </Link>
          'nı kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  )
}
