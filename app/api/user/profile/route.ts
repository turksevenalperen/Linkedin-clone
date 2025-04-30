import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  const { name, image } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user?.email || '' },
      data: { name, image },
    });

    return NextResponse.json({ message: 'Profil güncellendi', user: updatedUser });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
