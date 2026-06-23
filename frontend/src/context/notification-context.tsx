"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';

interface NotificationContextType {
  socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType>({ socket: null });

export const useNotificationSocket = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const { fetchNotifications, addNotification } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Fetch initial notifications
      fetchNotifications(token);

      // Connect Socket.IO
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // If API URL ends with /api, remove it for the socket connection
      const socketUrl = API_URL.replace(/\/api$/, '');
      
      const newSocket = io(socketUrl, {
        transports: ['websocket'],
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        console.log('Notification socket connected (Authenticated)');
      });

      newSocket.on('new-notification', (notification: Notification) => {
        addNotification(notification);
        
        // Play subtle sound
        try {
          const audio = new Audio('/notification-sound.mp3'); // We'll assume they have or don't need the file to exist to not crash
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio play failed, likely user interaction required first', e));
        } catch (e) {
          // ignore
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user?.id, token, fetchNotifications, addNotification]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
}
