/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `PromotionRequest` table. All the data in the column will be lost.
  - Added the required column `bannerId` to the `PromotionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromotionRequest" DROP COLUMN "expiresAt",
ADD COLUMN     "bannerId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "PromotionRequest" ADD CONSTRAINT "PromotionRequest_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
