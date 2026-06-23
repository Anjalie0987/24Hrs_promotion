import { TrackingService } from './tracking.service';
import type { Request, Response } from 'express';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    trackClick(promotionId: string, req: Request, res: Response): Promise<void>;
    trackQrScan(promotionId: string, req: Request, res: Response): Promise<void>;
    trackDownload(promotionId: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            bannerId: string;
            promotionId: string | null;
            downloaderId: string;
        };
    }>;
}
