"use client";

import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  BarChart3, 
  Award, 
  Info,
  Handshake,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  MoreVertical,
  BellRing
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const TABS = ['All', 'Unread', 'Promotion Requests', 'Approvals', 'Analytics', 'Trust Score', 'System Updates'];

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
    default: return <Info className="w-5 h-5 text-slate-500" />;
  }
};

const getDeepLinkForType = (type: string) => {
  switch (type) {
    case 'promotion_request': return '/promotion-requests';
    case 'promotion_approved':
    case 'promotion_rejected':
    case 'promotion_completed': return '/dashboard';
    case 'analytics_update': return '/analytics';
    case 'trust_score_update': return '/dashboard';
    default: return '#';
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

export default function NotificationsPage() {
  const { token } = useAuth();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Search filter
      const matchesSearch = 
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Tab filter
      switch (activeTab) {
        case 'Unread': return !n.isRead;
        case 'Promotion Requests': return n.type === 'promotion_request';
        case 'Approvals': return n.type === 'promotion_approved' || n.type === 'promotion_rejected' || n.type === 'promotion_completed';
        case 'Analytics': return n.type === 'analytics_update';
        case 'Trust Score': return n.type === 'trust_score_update';
        case 'System Updates': return n.type === 'system_announcement';
        default: return true; // All
      }
    });
  }, [notifications, activeTab, searchQuery]);

  const displayedNotifications = filteredNotifications.slice(0, visibleCount);

  const groupNotifications = (items: Notification[]) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];
  
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  
    items.forEach(n => {
      const d = new Date(n.createdAt);
      if (d >= startOfToday) today.push(n);
      else if (d >= startOfYesterday) yesterday.push(n);
      else earlier.push(n);
    });
  
    return { today, yesterday, earlier };
  };

  const grouped = groupNotifications(displayedNotifications);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'All': return notifications.length;
      case 'Unread': return notifications.filter(n => !n.isRead).length;
      case 'Promotion Requests': return notifications.filter(n => n.type === 'promotion_request').length;
      case 'Approvals': return notifications.filter(n => n.type === 'promotion_approved' || n.type === 'promotion_rejected' || n.type === 'promotion_completed').length;
      case 'Analytics': return notifications.filter(n => n.type === 'analytics_update').length;
      case 'Trust Score': return notifications.filter(n => n.type === 'trust_score_update').length;
      case 'System Updates': return notifications.filter(n => n.type === 'system_announcement').length;
      default: return 0;
    }
  };

  const handleMarkAllAsRead = () => { if (token) markAllAsRead(token); };
  const handleClearRead = () => { if (token) clearReadNotifications(token); };
  const handleMarkAsRead = (id: string) => { if (token) markAsRead(id, token); };
  const handleDelete = (id: string) => { if (token) deleteNotification(id, token); };

  const NotificationGroup = ({ title, items }: { title: string, items: Notification[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h4 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-4 px-1">{title}</h4>
        <div className="space-y-3">
          {items.map((notification) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={notification.id}
              className={cn(
                "group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl transition-all duration-300 relative border shadow-sm hover:shadow-md",
                !notification.isRead 
                  ? "bg-[#EEF5FF] border-blue-100/50" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              {/* Unread Left Border */}
              {!notification.isRead && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-12 bg-[#1E73E8] rounded-r-md" />
              )}
              
              {/* Icon */}
              <div className="shrink-0 relative hidden sm:block">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  {getIconForType(notification.type)}
                </div>
                {!notification.isRead && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1E73E8] rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className={cn(
                    "text-[15px]",
                    !notification.isRead ? "text-slate-900 font-semibold" : "text-slate-800 font-medium"
                  )}>
                    {notification.title || notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h5>
                  <span className="text-[12px] text-slate-400 font-medium whitespace-nowrap">
                    • {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="sm:hidden lg:inline">Mark Read</span>
                  </button>
                )}
                <Link 
                  href={getDeepLinkForType(notification.type)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="sm:hidden lg:inline">View</span>
                </Link>
                <button 
                  onClick={() => handleDelete(notification.id)}
                  className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-2">Notifications</h1>
              <p className="text-[15px] text-slate-500 max-w-2xl">
                Stay updated with promotion requests, approvals, analytics updates, and business activity.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={handleMarkAllAsRead}
                suppressHydrationWarning={true}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[14px] font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Mark All Read
              </button>
              <button 
                onClick={handleClearRead}
                suppressHydrationWarning={true}
                className="px-4 py-2.5 rounded-xl bg-[#1E73E8] text-white text-[14px] font-semibold shadow-sm hover:bg-[#2FA7F5] transition-all"
              >
                Clear Read
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
          
          {/* Horizontal Scroll Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 scrollbar-hide">
            {TABS.map(tab => {
              const count = getTabCount(tab);
              return (
                <button
                  key={tab}
                  suppressHydrationWarning={true}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap border",
                    activeTab === tab 
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {tab}
                  {count > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[12px]",
                      activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[320px] shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && notifications.length === 0 ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-[#EEF5FF] rounded-full flex items-center justify-center mb-6">
              <BellRing className="w-10 h-10 text-[#1E73E8]" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">No Notifications Yet</h3>
            <p className="text-[15px] text-slate-500 max-w-[400px] text-center mb-8">
              {searchQuery 
                ? "We couldn't find any notifications matching your search."
                : "You'll receive notifications about promotion requests, approvals, engagement tracking, and business activity."}
            </p>
            {(searchQuery || activeTab !== 'All') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
                suppressHydrationWarning={true}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[14px] hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            <NotificationGroup title="Today" items={grouped.today} />
            <NotificationGroup title="Yesterday" items={grouped.yesterday} />
            <NotificationGroup title="Earlier" items={grouped.earlier} />
            
            {visibleCount < filteredNotifications.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => setVisibleCount(v => v + 20)}
                  suppressHydrationWarning={true}
                  className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-[14px] shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  Load More Notifications
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
