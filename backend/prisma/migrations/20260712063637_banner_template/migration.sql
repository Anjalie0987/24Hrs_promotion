-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "bannerTemplate" TEXT DEFAULT 'corporate',
ALTER COLUMN "ownerName" DROP NOT NULL,
ALTER COLUMN "ownerName" DROP DEFAULT,
ALTER COLUMN "ownerPhotoUrl" DROP NOT NULL,
ALTER COLUMN "ownerPhotoUrl" DROP DEFAULT;
