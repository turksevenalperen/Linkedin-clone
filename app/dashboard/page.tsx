"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [darkMode, setDarkMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/me")
        .then((res) => res.json())
        .then((data) => setUserData(data));
    }
  }, [status]);


  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    fetchPosts();
  }, [status]);

  async function fetchPosts() {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    const data = await res.json();
    setPosts(data);
  }

  async function handleUploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'alperen');
    formData.append('folder', 'samples/ecommerce');

    const res = await fetch('https://api.cloudinary.com/v1_1/df3lrtc5r/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await handleUploadImage(imageFile);
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl }),
    });

    if (res.ok) {
      setContent('');
      setImageFile(null);
      fetchPosts();
    }
  }

  async function toggleLike(postId: string) {
    const res = await fetch('/api/posts/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) fetchPosts();
  }

  async function deletePost(postId: string) {
    const confirmed = window.confirm("Bu gönderiyi silmek istediğine emin misin?");
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) fetchPosts();
  }

  async function submitComment(postId: string) {
    const content = commentInputs[postId];
    const res = await fetch('/api/posts/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    });
    if (res.ok) {
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    }
  }

  if (status === 'loading') return <div className="text-center mt-10">Yükleniyor...</div>;

  return (
    <div className={darkMode ? 'dark bg-zinc-900 text-white min-h-screen' : 'bg-gray-50 text-black min-h-screen'}>
      <nav className="flex justify-between items-center w-full px-6 py-4 border-b dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <a href="/" className="text-xl font-bold text-blue-700 dark:text-blue-400">
          LinkedIn
        </a>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:underline">Makaleler</a>
          <a href="#" className="hover:underline">Kişiler</a>
          <a href="#" className="hover:underline">Learning</a>
          <a href="/job-posts" className="hover:underline">İş İlanları</a>

          <div className="flex justify-end max-w-7xl mx-auto p-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-zinc-800"
            >
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto p-4">
        
        {/* Sol - Profil */}
        <div className="hidden md:block space-y-4">
        {userData && (
  <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
    <Image
      src={userData.image || '/default-avatar.png'}
      alt="Profil Fotoğrafı"
      width={80}
      height={80}
      className="rounded-full object-cover"
    />
    <h2 className="mt-4 text-lg font-semibold">{userData.name || 'Kullanıcı'}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Öğrenci Kariyeri</p>

    {/* Düzenle Butonu */}
    <button
      onClick={() => setIsEditModalOpen(true)}
      className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600"
    >
      Düzenle
    </button>
  </div>
)}
  <button
  onClick={() => router.push('/add-job/')}
  className="mt-4 px-4 py-2 text-sm bg-green-500 text-white rounded-full hover:bg-green-600"
>
  İş İlanı Ver
</button>

            
         
        </div>

        {/* Orta - Post Form ve Postlar */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Post Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-6 space-y-4">
            <textarea
              placeholder="Ne düşünüyorsun?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={4}
            />
            <input
              type="file"
              accept="image/*"
              title="Resim yükle"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-zinc-700 file:text-blue-700 hover:file:bg-blue-100 dark:hover:file:bg-zinc-600"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Paylaş
            </button>
          </form>

          <div className="space-y-6">
  {posts.map((post) => (
    <div key={post.id} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-5">
      
      {/* Kullanıcı Bilgisi */}
      {post.author && (
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name || 'Kullanıcı'}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {post.author.name || 'Kullanıcı'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    

      {/* Post İçeriği */}
      <p className="text-gray-800 dark:text-gray-100 mb-3">{post.content}</p>

      {/* Post Resmi */}
      {post.imageUrl && (
        <div className="overflow-hidden rounded-xl mb-3">
          <Image
            src={post.imageUrl}
            alt="post"
            width={500}
            height={350}
            className="object-cover rounded-xl"
          />
        </div>
      )}

      {/* Beğen & Sil Butonları */}
      <div className="flex items-center space-x-3 mt-4">
        <button
          onClick={() => toggleLike(post.id)}
          className="text-sm text-blue-600 hover:underline"
        >
          ❤️ Beğen ({post.likes?.length || 0})
        </button>
        <button
          onClick={() => deletePost(post.id)}
          className="text-sm text-red-600 hover:underline"
        >
          Sil
        </button>
      </div>

      {/* Yorum Yapma */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Yorum yaz..."
          value={commentInputs[post.id] || ''}
          onChange={(e) =>
            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
          }
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={() => submitComment(post.id)}
          className="text-sm text-green-600 dark:text-green-400 mt-1 hover:underline"
        >
          Gönder
        </button>
      </div>

      {/* Yorumlar */}
      {post.comments && post.comments.map((c: any) => (
        <div
          key={c.id}
          className="mt-3 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-zinc-700 pt-2"
        >
          <strong className="text-blue-600 dark:text-blue-400">{c.user?.name || 'Kullanıcı'}:</strong> {c.content}
        </div>
      ))}
    </div>
  ))}
</div>


        {/* Sağ - Haberler */}
        <div className="hidden md:block space-y-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">LinkedIn Haberler</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Most US iPhones to come from India 📱</li>
              <li>Farmers brace for a tough 2026 🚜</li>
              <li>Snacking is down, anxiety is up 😰</li>
              <li>You might own a Waymo 🚗</li>
              <li>Walmart aims to shield China biz 🛒</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Profil Düzenleme Modalı */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
    </div>
  );
}
