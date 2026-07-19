import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: AuthenticatedRequest, skip?: string, take?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            type: string;
            userId: string;
            title: string | null;
            message: string;
            isRead: boolean;
        }[];
        unreadCount: number;
    }>;
    markAllAsRead(req: AuthenticatedRequest): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string, req: AuthenticatedRequest): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteReadNotifications(req: AuthenticatedRequest): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, req: AuthenticatedRequest): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
