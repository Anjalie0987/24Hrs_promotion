import { TrackingService } from './tracking.service';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    trackClick(promotionId: string, req: Request, res: Response): Promise<void>;
    trackQrScan(promotionId: string, req: Request, res: Response): Promise<void>;
    trackDownload(promotionId: string, req: AuthenticatedRequest): Promise<{
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
