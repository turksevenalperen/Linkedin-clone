"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { tr } from "date-fns/locale";
import { MessageCircle, Heart } from "lucide-react";

type Props = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    posts: {
      id: string;
      content: string;
      imageUrl: string | null;
      createdAt: string;
      commentsCount: number;
      likesCount: number;
    }[];
  };
};

export default function ProfilePageClient({ user }: Props) {
  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
      {/* Profil Kartı */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name || "Profil"} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name || "İsimsiz Kullanıcı"}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Separator />

      {/* Postlar */}
      {user.posts.length === 0 ? (
        <p className="text-center text-gray-500">Hiç post paylaşmamışsın.</p>
      ) : (
        user.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="text-base">{post.content}</CardTitle>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </p>
            </CardHeader>
            {post.imageUrl && (
              <CardContent>
                <img
                  src={post.imageUrl}
                  alt="Post görseli"
                  className="rounded-md max-h-96 w-full object-cover"
                />
              </CardContent>
            )}
            <CardFooter className="flex space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likesCount}</span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
