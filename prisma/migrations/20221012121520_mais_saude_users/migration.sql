-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINE', 'FEMENINE', 'OTHERS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "conditions" BOOLEAN NOT NULL DEFAULT true,
    "fullname" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "photoURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fkIdinformations" TEXT NOT NULL,
    "fkIdAddress" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informations" (
    "id" TEXT NOT NULL,
    "cpf" INTEGER NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "complement" TEXT,
    "state" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_fkIdinformations_key" ON "users"("fkIdinformations");

-- CreateIndex
CREATE UNIQUE INDEX "users_fkIdAddress_key" ON "users"("fkIdAddress");

-- CreateIndex
CREATE UNIQUE INDEX "informations_cpf_key" ON "informations"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "informations_phone_key" ON "informations"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "informations_email_key" ON "informations"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fkIdinformations_fkey" FOREIGN KEY ("fkIdinformations") REFERENCES "informations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fkIdAddress_fkey" FOREIGN KEY ("fkIdAddress") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
