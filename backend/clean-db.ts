import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database (removing all testing data)...');
  
  try {
    // Truncate all tables and cascade deletes
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "User", 
        "Business", 
        "Promotion", 
        "PromotionRequest", 
        "Banner", 
        "Notification", 
        "SavedPartner", 
        "ClickTracking", 
        "QRScanTracking", 
        "BannerDownload", 
        "Otp" 
      CASCADE;
    `);
    console.log('Successfully removed all testing data!');
  } catch (error) {
    console.error('Error cleaning database:', error);
    
    // Fallback: Use deleteMany in reverse dependency order if TRUNCATE fails due to permissions
    console.log('Attempting fallback method using deleteMany...');
    await prisma.clickTracking.deleteMany();
    await prisma.qRScanTracking.deleteMany();
    await prisma.bannerDownload.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.savedPartner.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.promotionRequest.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.business.deleteMany();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    console.log('Successfully removed all testing data using fallback method!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
