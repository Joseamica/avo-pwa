/*
  Warnings:

  - You are about to drop the column `showMenuImage` on the `Venue` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PosNames" AS ENUM ('WANSOFT', 'SOFTRESTAURANT');

-- AlterEnum
ALTER TYPE "RoleEnumType" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chainId" TEXT;

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "showMenuImage",
ADD COLUMN     "configurationId" TEXT,
ADD COLUMN     "posName" "PosNames",
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "cuisine" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "dynamicMenu" BOOLEAN DEFAULT false,
    "branding" BOOLEAN DEFAULT false,
    "posName" "PosNames",
    "stripeAccountId" TEXT,
    "tipPercentage1" TEXT NOT NULL DEFAULT '0.10',
    "tipPercentage2" TEXT NOT NULL DEFAULT '0.15',
    "tipPercentage3" TEXT NOT NULL DEFAULT '0.20',
    "paymentMethods" TEXT[] DEFAULT ARRAY['card']::TEXT[],
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
