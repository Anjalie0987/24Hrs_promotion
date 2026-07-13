"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Cleaning database (removing all testing data)...');
    try {
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
    }
    catch (error) {
        console.error('Error cleaning database:', error);
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
//# sourceMappingURL=clean-db.js.map