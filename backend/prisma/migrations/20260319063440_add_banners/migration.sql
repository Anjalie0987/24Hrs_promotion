/*
  Warnings:

  - You are about to drop the column `promotionId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `bannerId` on the `PromotionRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionRequest" DROP CONSTRAINT "PromotionRequest_bannerId_fkey";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "promotionId",
ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "logo",
DROP COLUMN "ownerId",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "PromotionRequest" DROP COLUMN "bannerId";

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
