import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsCron {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleCron(): Promise<void>;
}
