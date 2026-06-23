"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Handshake, 
  CheckCircle2, 
  XCircle, 
  Download, 
  BarChart3, 
  X, 
  BellRing,
  Award,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotificationStore, Notification, NotificationType } from "@/store/useNotificationStore";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

const getIconForType = (type: string) => {
  switch (type) {
    case 'promotion_request': return <Handshake className="w-5 h-5 text-blue-500" />;
    case 'promotion_approved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'promotion_completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'promotion_rejected': return <XCircle className="w-5 h-5 text-red-500" />;
    case 'banner_downloaded': return <Download className="w-5 h-5 text-purple-500" />;
    case 'analytics_update': return <BarChart3 className="w-5 h-5 text-amber-500" />;
    case 'trust_score_update': return <Award className="w-5 h-5 text-orange-500" />;
    case 'system_announcement': return <Info className="w-5 h-5 text-blue-400" />;
    default: return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const groupNotifications = (notifications: Notification[]) => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

  notifications.forEach(n => {
    const d = new Date(n.createdAt);
    if (d >= startOfToday) {
      today.push(n);
    } else if (d >= startOfYesterday) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  return { today, yesterday, earlier };
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { token } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  const handleMarkAllAsRead = () => {
    if (token) markAllAsRead(token);
  };

  const handleMarkAsRead = (id: string) => {
    if (token) markAsRead(id, token);
  };

  const grouped = groupNotifications(notifications);

  const NotificationGroup = ({ title, items }: { title: string, items: Notification[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">{title}</h4>
        <div className="space-y-1">
          {items.map((notification) => (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              className={cn(
                "flex items-start gap-3 p-[14px] rounded-xl transition-all duration-200 cursor-pointer relative",
                "hover:bg-[#F8FAFF] hover:-translate-y-[1px]",
                !notification.isRead ? "bg-[#EEF5FF]" : "bg-white"
              )}
            >
              {!notification.isRead && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#1E73E8] rounded-r-md" />
              )}
              
              <div className="shrink-0 mt-0.5 relative">
                {getIconForType(notification.type)}
                {!notification.isRead && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1E73E8] rounded-full border-2 border-[#EEF5FF]" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[14px] leading-tight mb-1",
                  !notification.isRead ? "text-slate-900 font-medium" : "text-slate-600"
                )}>
                  {notification.message}
                </p>
                <p className="text-[12px] text-slate-400">
                  {formatTimeAgo(notification.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const NotificationList = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h3 className="font-semibold text-slate-800 text-[16px]">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-[13px] font-medium text-[#1E73E8] hover:text-[#2FA7F5] transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className={cn(
        "overflow-y-auto overscroll-contain p-2",
        !isMobile ? "max-h-[380px]" : "h-[calc(100vh-120px)]"
      )}>
        {isLoading && notifications.length === 0 ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <BellRing className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] font-medium text-slate-700 mb-1">No Notifications Yet</p>
            <p className="text-[13px] text-slate-500">
              We'll notify you about promotion requests, approvals, and engagement updates.
            </p>
          </div>
        ) : (
          <div>
            <NotificationGroup title="Today" items={grouped.today} />
            <NotificationGroup title="Yesterday" items={grouped.yesterday} />
            <NotificationGroup title="Earlier" items={grouped.earlier} />
          </div>
        )}
      </div>

      <div className="p-2 border-t border-slate-100 sticky bottom-0 bg-white z-10">
        <Link href="/notifications" className="block w-full py-2.5 rounded-xl text-center text-[14px] font-medium text-[#1E73E8] hover:bg-[#F8FAFF] transition-colors">
          View All Notifications
        </Link>
      </div>
    </>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        animate={unreadCount > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, repeat: isOpen ? 0 : 1, repeatType: "reverse" }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 relative",
          isOpen ? "bg-[#EEF5FF] text-[#1E73E8]" : "bg-transparent text-slate-600 hover:bg-[#EEF5FF] hover:text-[#1E73E8]"
        )}
      >
        <Bell className="w-[22px] h-[22px]" />
        
        {unreadCount > 0 && (
          <span className="absolute top-[8px] right-[8px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
        {unreadCount > 1 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Desktop Dropdown */}
      {!isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-[18px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden z-50 origin-top-right"
            >
              <NotificationList />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Slide-over */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 z-[60]"
              />
              
              {/* Slide Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <h2 className="text-[18px] font-semibold text-slate-800">Notifications</h2>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                  <NotificationList />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
