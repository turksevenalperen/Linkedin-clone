// app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth(); // Yeni sistemde auth() ile session alınır

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center w-full">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center w-full px-6 py-4 border-b">
        <Link href="/" className="text-xl font-bold text-blue-700">
          LinkedIn
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="#" className="hover:underline">Makaleler</Link>
          <Link href="#" className="hover:underline">Kişiler</Link>
          <Link href="#" className="hover:underline">Learning</Link>
          <Link href="#" className="hover:underline">İş İlanları</Link>
          <Link href="/register" className="text-blue-600 hover:underline">Hemen Katılın</Link>
          <Link href="/login" className="border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50">Oturumu Aç</Link>
        </div>
      </nav>

      {/* HOŞ GELDİN */}
      <section className="bg-white w-full text-center py-16 px-6">
        <h1 className="text-black text-4xl font-bold mb-6">Profesyonel topluluğunuza hoş geldiniz!</h1>
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <p className="text-xs text-gray-600 text-center mt-2 max-w-xs">
            Devam Et seçeneğini tıklayarak veya oturum açarak LinkedIn Kullanıcı Anlaşması’nı, Gizlilik Politikası’nı ve Çerez Politikası’nı kabul etmiş olursunuz.
          </p>
          <p className="text-black text-sm mt-4">LinkedIn‘de yeni misiniz? <Link href="/signup" className="text-blue-600 hover:underline">Hemen katılın</Link></p>
        </div>
      </section>

      {/* MESLEKLER */}
      <section className="bg-gray-100 w-full py-16 px-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">Sizin için uygun olan işi veya stajı bulun</h2>
        <div className="flex flex-wrap gap-4 justify-center text-black">
          {[
            "Mühendislik", "İş Geliştirme", "Finans", "Yönetici Asistanı", "Perakende Uzmanı",
            "Müşteri Hizmetleri", "Operasyon", "Bilgi Teknolojisi", "Pazarlama", "İnsan Kaynakları"
          ].map((item) => (
            <button key={item} className="rounded-full bg-white px-4 py-2 border hover:bg-gray-200 text-sm">
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* İŞ İLANI */}
      <section className="bg-[#f3f2ef] w-full py-16 px-6 text-center">
        <h2 className="text-xl text-black font-semibold mb-4">Milyonlarca kişinin iş ilanınızı görmesi için işinizi yayınlayın</h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">İş ilanı yayınla</button>
      </section>

      {/* BİLGİ SEKMESİ */}
      <section className="bg-white w-full py-16 px-6 flex justify-center">
        <div className="max-w-5xl w-full flex justify-between items-center">
          <div>
            <h3 className="text-lg text-black font-semibold">LinkedIn size nasıl yardımcı olabilir?</h3>
          </div>
          <div className="text-3xl cursor-pointer text-blue-600">→</div>
        </div>
      </section>

      {/* KATILIM ÇAĞRISI */}
      <section className="bg-blue-50 w-full py-12 px-6 text-center">
        <h2 className="text-xl text-black font-semibold">LinkedIn‘deki iş arkadaşlarınıza, okul arkadaşlarınıza ve dostlarınıza katılın.</h2>
        <Link
          href="/login"
          className="inline-block text-black bg-white border border-gray-400 px-6 py-2 rounded mt-4 hover:bg-gray-100"
        >
          Giriş Yap
        </Link>
      </section>
    </main>
  );
}
