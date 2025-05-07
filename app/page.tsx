import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, Lightbulb, ArrowRight } from "lucide-react"

export default async function Home() {
  const session = await auth() // Yeni sistemde auth() ile session alınır

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-zinc-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto w-full">
          <nav className="flex justify-between items-center w-full px-4 md:px-6 py-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              LinkedIn
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Makaleler
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Kişiler
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Learning
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                İş İlanları
              </Link>
              <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                Hemen Katılın
              </Link>
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Link href="/login">Oturumu Aç</Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              >
                <Link href="/login">Giriş</Link>
              </Button>
              <Button asChild size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                <Link href="/register">Kayıt</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* HOŞ GELDİN */}
      <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Profesyonel topluluğunuza hoş geldiniz!
          </h1>
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2 max-w-xs">
              Devam Et seçeneğini tıklayarak veya oturum açarak LinkedIn Kullanıcı Anlaşması'nı, Gizlilik Politikası'nı
              ve Çerez Politikası'nı kabul etmiş olursunuz.
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-sm mt-4">
              LinkedIn'de yeni misiniz?{" "}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                Hemen katılın
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* MESLEKLER */}
      <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Sizin için uygun olan işi veya stajı bulun
          </h2>
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {[
              "Mühendislik",
              "İş Geliştirme",
              "Finans",
              "Yönetici Asistanı",
              "Perakende Uzmanı",
              "Müşteri Hizmetleri",
              "Operasyon",
              "Bilgi Teknolojisi",
              "Pazarlama",
              "İnsan Kaynakları",
            ].map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                className="rounded-full bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* İŞ İLANI */}
      <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-zinc-900">
        <Card className="max-w-3xl mx-auto border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Milyonlarca kişinin iş ilanınızı görmesi için işinizi yayınlayın
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Briefcase className="mr-2 h-4 w-4" />
              İş ilanı yayınla
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* BİLGİ SEKMESİ */}
      <section className="w-full py-8 md:py-12 px-4 md:px-6 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-5xl mx-auto">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    LinkedIn size nasıl yardımcı olabilir?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Kariyer fırsatları, ağ oluşturma ve daha fazlası hakkında bilgi edinin
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bağlantılar Kurun</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Profesyonel ağınızı genişletin ve yeni fırsatlar keşfedin
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">İş Bulun</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Becerilerinize uygun iş fırsatlarını keşfedin
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <Lightbulb className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bilgi Edinin</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sektörünüzdeki en son gelişmeleri ve trendleri takip edin
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* KATILIM ÇAĞRISI */}
      <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            LinkedIn'deki iş arkadaşlarınıza, okul arkadaşlarınıza ve dostlarınıza katılın.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
            >
              <Link href="/login">Giriş Yap</Link>
            </Button>
         n   <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Hemen Katıl</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 px-4 md:px-6 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                LinkedIn
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">© 2025</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Kullanım Koşulları
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Topluluk Kuralları
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Çerez Politikası
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Telif Hakkı Politikası
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
