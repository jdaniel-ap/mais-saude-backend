/*
  Warnings:

  - A unique constraint covering the columns `[fkIdAuth]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `fkIdAuth` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fkIdAuth" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "auth" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_fkIdAuth_key" ON "users"("fkIdAuth");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fkIdAuth_fkey" FOREIGN KEY ("fkIdAuth") REFERENCES "auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
