import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    createNotification(userId: string, title: string, message: string, type: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        title: string | null;
        message: string;
        isRead: boolean;
    }>;
    getUserNotifications(userId: string, skip?: number, take?: number): Promise<{
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
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteReadNotifications(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
