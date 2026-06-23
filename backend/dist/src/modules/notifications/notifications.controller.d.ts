import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, skip?: string, take?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            type: string;
            userId: string;
            message: string;
            title: string | null;
            isRead: boolean;
        }[];
        unreadCount: number;
    }>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string, req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteReadNotifications(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
