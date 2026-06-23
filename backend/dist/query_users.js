"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function main() {
    const prisma = new client_1.PrismaClient();
    const users = await prisma.user.findMany({
        take: 5,
        select: {
            email: true,
        }
    });
    console.log('Recent Users:', users);
    await prisma.$disconnect();
}
main().catch(console.error);
//# sourceMappingURL=query_users.js.map