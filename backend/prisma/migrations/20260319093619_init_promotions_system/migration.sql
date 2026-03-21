/*
  Warnings:

  - You are about to drop the column `businessId` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the `Analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromotionProof` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[requestId]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestId` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_businessId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionProof" DROP CONSTRAINT "PromotionProof_promotionId_fkey";

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "businessId",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "receiverProof" TEXT,
ADD COLUMN     "requestId" TEXT NOT NULL,
ADD COLUMN     "senderProof" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "Analytics";

-- DropTable
DROP TABLE "PromotionProof";

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_requestId_key" ON "Promotion"("requestId");

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PromotionRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
