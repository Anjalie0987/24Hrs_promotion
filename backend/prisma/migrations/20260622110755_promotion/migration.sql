/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Banner` table. All the data in the column will be lost.
  - The `status` column on the `Promotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `PromotionRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `originalImageUrl` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'DISPUTED');

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "imageUrl",
ADD COLUMN     "originalImageUrl" TEXT NOT NULL,
ADD COLUMN     "watermarkedImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "status",
ADD COLUMN     "status" "PromotionStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "PromotionRequest" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ClickTracking" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRScanTracking" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRScanTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerDownload" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT,
    "bannerId" TEXT NOT NULL,
    "downloaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannerDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClickTracking_promotionId_idx" ON "ClickTracking"("promotionId");

-- CreateIndex
CREATE INDEX "ClickTracking_bannerId_idx" ON "ClickTracking"("bannerId");

-- CreateIndex
CREATE INDEX "ClickTracking_createdAt_idx" ON "ClickTracking"("createdAt");

-- CreateIndex
CREATE INDEX "QRScanTracking_promotionId_idx" ON "QRScanTracking"("promotionId");

-- CreateIndex
CREATE INDEX "QRScanTracking_bannerId_idx" ON "QRScanTracking"("bannerId");

-- CreateIndex
CREATE INDEX "QRScanTracking_createdAt_idx" ON "QRScanTracking"("createdAt");

-- CreateIndex
CREATE INDEX "BannerDownload_promotionId_idx" ON "BannerDownload"("promotionId");

-- CreateIndex
CREATE INDEX "BannerDownload_bannerId_idx" ON "BannerDownload"("bannerId");

-- CreateIndex
CREATE INDEX "BannerDownload_downloaderId_idx" ON "BannerDownload"("downloaderId");

-- CreateIndex
CREATE INDEX "BannerDownload_createdAt_idx" ON "BannerDownload"("createdAt");

-- CreateIndex
CREATE INDEX "Otp_email_code_idx" ON "Otp"("email", "code");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Promotion_status_idx" ON "Promotion"("status");

-- CreateIndex
CREATE INDEX "PromotionRequest_senderBusinessId_idx" ON "PromotionRequest"("senderBusinessId");

-- CreateIndex
CREATE INDEX "PromotionRequest_receiverBusinessId_idx" ON "PromotionRequest"("receiverBusinessId");

-- CreateIndex
CREATE INDEX "PromotionRequest_status_idx" ON "PromotionRequest"("status");

-- AddForeignKey
ALTER TABLE "ClickTracking" ADD CONSTRAINT "ClickTracking_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickTracking" ADD CONSTRAINT "ClickTracking_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRScanTracking" ADD CONSTRAINT "QRScanTracking_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRScanTracking" ADD CONSTRAINT "QRScanTracking_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerDownload" ADD CONSTRAINT "BannerDownload_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerDownload" ADD CONSTRAINT "BannerDownload_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerDownload" ADD CONSTRAINT "BannerDownload_downloaderId_fkey" FOREIGN KEY ("downloaderId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
