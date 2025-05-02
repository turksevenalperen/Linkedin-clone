-- CreateTable
CREATE TABLE "Sorunsal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Sorunsal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SorunsalComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "sorunsalId" TEXT NOT NULL,

    CONSTRAINT "SorunsalComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sorunsal" ADD CONSTRAINT "Sorunsal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorunsalComment" ADD CONSTRAINT "SorunsalComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorunsalComment" ADD CONSTRAINT "SorunsalComment_sorunsalId_fkey" FOREIGN KEY ("sorunsalId") REFERENCES "Sorunsal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
