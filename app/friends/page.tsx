import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import FriendList from "@/components/FriendList"
import FriendRequests from "@/components/FriendRequests"
import Navbar from "@/components/PcNavbar"
import MobileMenu from "@/components/PhoneNavbar"




export default async function FriendsPage() {
  const session = await auth()
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  })

  if (!currentUser) return <div>Giriş yapman gerek</div>

  return (
    <div>
      <div>
      <Navbar/>
      <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <h1 className="text-2xl font-semibold">Arkadaşlar</h1>

      <section>
        <h2 className="text-lg font-medium mb-2">Bekleyen İstekler</h2>
        <FriendRequests />
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Kullanıcılar</h2>
        <FriendList currentUserId={currentUser.id} />
      </section>
    </div>
    </div>
    <MobileMenu/>
    
    </div>
    
    
  )
}
