import { create } from 'zustand';
import axios from 'axios';

export type NotificationType = 
  | 'promotion_request' 
  | 'promotion_approved' 
  | 'promotion_rejected' 
  | 'promotion_completed' 
  | 'banner_downloaded' 
  | 'analytics_update' 
  | 'trust_score_update' 
  | 'system_announcement';

export interface Notification {
  id: string;
  userId: string;
  title: string | null;
  message: string;
  type: NotificationType | string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasLoadedInitial: boolean;
  
  // Actions
  fetchNotifications: (token: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string, token: string) => Promise<void>;
  markAllAsRead: (token: string) => Promise<void>;
  deleteNotification: (id: string, token: string) => Promise<void>;
  clearReadNotifications: (token: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasLoadedInitial: false,

  fetchNotifications: async (token: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/notifications?take=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ 
        notifications: response.data.items, 
        unreadCount: response.data.unreadCount,
        isLoading: false,
        hasLoadedInitial: true
      });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      set({ isLoading: false });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: async (id: string, token: string) => {
    // Optimistic update
    const previousUnread = get().unreadCount;
    const notification = get().notifications.find(n => n.id === id);
    if (!notification || notification.isRead) return;

    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));

    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to mark as read', error);
      // Revert if failed (optional, simplified here)
    }
  },

  markAllAsRead: async (token: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0
    }));

    try {
      await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  },

  deleteNotification: async (id: string, token: string) => {
    const notification = get().notifications.find(n => n.id === id);
    
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: (notification && !notification.isRead) 
        ? Math.max(0, state.unreadCount - 1) 
        : state.unreadCount
    }));

    try {
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  },

  clearReadNotifications: async (token: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => !n.isRead)
    }));

    try {
      await axios.delete(`${API_URL}/notifications/read-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to clear read notifications', error);
    }
  }
}));
