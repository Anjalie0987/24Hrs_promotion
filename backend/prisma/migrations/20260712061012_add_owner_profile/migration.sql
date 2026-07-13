-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "ownerName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ownerPhotoUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "yearsExperience" INTEGER;
