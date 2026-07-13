"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Building2, 
  Globe, 
  Instagram, 
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  MessageSquareShare,
  CalendarDays,
  MousePointerClick,
  ScanBarcode,
  Info
} from "lucide-react";
import { Business, useDiscoveryStore } from "@/store/useDiscoveryStore";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ProfileDrawerProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestPromotion: (b: Business) => void;
}

export function ProfileDrawer({ business: initialBusiness, isOpen, onClose, onRequestPromotion }: ProfileDrawerProps) {
  const { token } = useAuth();
  const { savedPartnerIds, toggleSavePartner } = useDiscoveryStore();
  
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (isOpen && initialBusiness && token) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`${API_URL}/business/${initialBusiness.id}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(res.data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          toast.error("Failed to load full profile details");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
      setShowFullDesc(false);
    }
  }, [isOpen, initialBusiness, token]);

  if (!isOpen || !initialBusiness) return null;

  // Use loaded profile if available, fallback to initial business
  const data = profile || initialBusiness;
  const isSaved = savedPartnerIds.includes(data.id);
  const btnDisabled = data.requestStatus === 'PENDING' || data.requestStatus === 'ACTIVE' || data.requestStatus === 'REJECTED';

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/business/${data.id}`);
    toast.success("Profile link copied to clipboard");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[520px] lg:w-[600px] bg-[#F8FAFF] shadow-2xl z-[70] flex flex-col overflow-hidden"
          >
            {/* Header Sticky Actions */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button 
                onClick={() => { if (token) toggleSavePartner(data.id, token); }}
                className="p-2.5 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-sm transition-all text-slate-700 hover:text-[#1E73E8]"
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#1E73E8]" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-sm transition-all text-slate-700 hover:text-[#1E73E8]"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-sm transition-all text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
              {/* Banner */}
              <div className="h-48 md:h-56 bg-slate-200 relative shrink-0">
                {isLoading && !profile ? (
                  <div className="w-full h-full bg-slate-200 animate-pulse" />
                ) : data.bannerUrl ? (
                  <img src={data.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E73E8]/10 to-[#2FA7F5]/20 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-[#1E73E8]/20" />
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm text-[12px] font-bold">
                  {data.isAvailable ? (
                    <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-emerald-700">Available for Promotion</span></>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-red-700">Currently Busy</span></>
                  )}
                </div>
              </div>

              <div className="px-6 md:px-8 relative pb-8">
                {/* Logo & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-6 relative z-10">
                  {isLoading && !profile ? (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-200 animate-pulse border-4 border-[#F8FAFF]" />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-lg border-4 border-[#F8FAFF] flex items-center justify-center shrink-0 overflow-hidden">
                      {data.logoUrl ? (
                        <img src={data.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2 sm:pt-16">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 leading-tight">
                        {data.name}
                      </h2>
                      {data.isVerified && (
                        <CheckCircle2 className="w-6 h-6 text-[#1E73E8]" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-block text-[14px] font-bold text-[#1E73E8] bg-[#EEF5FF] px-2.5 py-1 rounded-lg">
                        {data.category}
                      </span>
                      {(data.city || data.state) && (
                        <span className="flex items-center gap-1.5 text-[14px] font-medium text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {data.city}{data.city && data.state ? ', ' : ''}{data.state}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Reason Banner */}
                {data.matchReason && (
                  <div className="mb-8 p-4 bg-[#EEF5FF] rounded-2xl border border-blue-100 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-8 h-8 rounded-full bg-[#1E73E8] flex items-center justify-center shrink-0 text-white">
                      <SparklesIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 mb-0.5 flex items-center gap-2">
                        Why this is a match <span className="bg-[#1E73E8] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{data.matchScore}%</span>
                      </h4>
                      <p className="text-[14px] text-slate-600">{data.matchReason}</p>
                    </div>
                  </div>
                )}

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {isLoading && !profile ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />)
                  ) : (
                    <>
                      <MetricCard icon={<Award className="w-5 h-5 text-amber-500" />} label="Trust Score" value={`${data.trustScore}%`} colorClass="bg-amber-50" />
                      <MetricCard icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} label="Success Rate" value={`${data.metrics?.successRate || 100}%`} colorClass="bg-emerald-50" />
                      <MetricCard icon={<CheckCircle2 className="w-5 h-5 text-[#1E73E8]" />} label="Completed" value={data.metrics?.completedPromotions || 0} colorClass="bg-blue-50" />
                      <MetricCard icon={<MessageSquareShare className="w-5 h-5 text-purple-500" />} label="Engagement" value={formatNumber(data.metrics?.totalEngagement || 0)} colorClass="bg-purple-50" />
                    </>
                  )}
                </div>

                {/* Social Links */}
                <div className="mb-8 flex gap-3">
                  {data.website ? (
                    <a href={data.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                      <Globe className="w-4 h-4 text-slate-400" /> Visit Website
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-semibold text-slate-400">
                      <Globe className="w-4 h-4" /> Website not added
                    </div>
                  )}
                  {data.instagram ? (
                    <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-pink-50 hover:border-pink-200 hover:text-[#E1306C] transition-all shadow-sm">
                      <Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-semibold text-slate-400">
                      <Instagram className="w-4 h-4" /> Not connected
                    </div>
                  )}
                </div>

                {/* About Business */}
                <div className="mb-10 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-3">About Business</h3>
                  {data.description ? (
                    <div className="relative">
                      <p className={cn(
                        "text-[15px] text-slate-600 leading-relaxed",
                        !showFullDesc && "line-clamp-3"
                      )}>
                        {data.description}
                      </p>
                      {data.description.length > 150 && (
                        <button 
                          onClick={() => setShowFullDesc(!showFullDesc)}
                          className="mt-2 text-[14px] font-bold text-[#1E73E8] hover:text-[#2FA7F5] flex items-center gap-1"
                        >
                          {showFullDesc ? <>Read Less <ChevronUp className="w-4 h-4" /></> : <>Read More <ChevronDown className="w-4 h-4" /></>}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-[14px] italic text-slate-400 flex items-center gap-2">
                      <Info className="w-4 h-4" /> No business description available
                    </p>
                  )}
                </div>

                {/* Performance Insights */}
                {profile && profile.metrics && profile.metrics.completedPromotions > 0 && (
                  <div className="mb-10">
                    <h3 className="text-[18px] font-bold text-slate-900 mb-4">Performance Insights</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                      <InsightBar 
                        icon={<MousePointerClick className="w-5 h-5 text-[#1E73E8]" />}
                        label="Average Clicks / Promotion"
                        value={profile.metrics.avgClicks}
                        max={300}
                        color="bg-[#1E73E8]"
                      />
                      <InsightBar 
                        icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />}
                        label="Promotion Completion Rate"
                        value={`${profile.metrics.completionRate}%`}
                        max={100}
                        current={profile.metrics.completionRate}
                        color="bg-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* Recent Activity Timeline */}
                {profile && profile.recentActivity && profile.recentActivity.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-[18px] font-bold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        {profile.recentActivity.map((activity: any, index: number) => (
                          <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Marker */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {activity.type === 'promotion' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {activity.type === 'insight' && <TrendingUp className="w-4 h-4 text-[#1E73E8]" />}
                              {activity.type === 'trust' && <Award className="w-4 h-4 text-amber-500" />}
                              {activity.type === 'system' && <Building2 className="w-4 h-4 text-slate-400" />}
                            </div>
                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900 text-[14px]">{activity.title}</h4>
                                <time className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(activity.date).toLocaleDateString()}</time>
                              </div>
                              <p className="text-[13px] text-slate-600">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Businesses */}
                {profile && profile.relatedBusinesses && profile.relatedBusinesses.length > 0 && (
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900 mb-4">Similar Businesses</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.relatedBusinesses.map((b: any) => (
                        <div key={b.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-[#1E73E8]/30 hover:shadow-sm transition-all cursor-pointer">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
                            {b.logoUrl ? <img src={b.logoUrl} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 m-auto mt-3 text-slate-300" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[14px] font-bold text-slate-900 truncate">{b.name}</h4>
                            <p className="text-[12px] text-slate-500 truncate">{b.category} • {b.city}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-5 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex gap-3">
              <button 
                onClick={() => {
                  onRequestPromotion(data);
                  onClose();
                }}
                disabled={btnDisabled || !data.isAvailable}
                className={cn(
                  "flex-1 py-3.5 rounded-xl text-[15px] font-bold shadow-sm transition-all flex items-center justify-center gap-2",
                  !data.isAvailable && !btnDisabled 
                    ? "bg-slate-100 text-slate-400" 
                    : btnDisabled
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                      : "bg-[#1E73E8] text-white hover:bg-[#2FA7F5] hover:shadow-md"
                )}
              >
                {!data.isAvailable && !btnDisabled 
                  ? "Not Accepting Requests" 
                  : data.requestStatus === 'PENDING' 
                    ? "Request Sent"
                    : data.requestStatus === 'ACTIVE'
                      ? "Promotion Active"
                      : data.requestStatus === 'REJECTED'
                        ? "Request Declined"
                        : "Start Promotion"
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Subcomponents
function MetricCard({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: string | number, colorClass: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", colorClass)}>
        {icon}
      </div>
      <span className="text-[20px] font-black text-slate-900 leading-tight">{value}</span>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

function InsightBar({ icon, label, value, max, current, color }: { icon: React.ReactNode, label: string, value: string | number, max: number, current?: number, color: string }) {
  const percent = current !== undefined ? current : Math.min(100, ((value as number) / max) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-[14px] font-bold text-slate-700">
          {icon} {label}
        </div>
        <span className="text-[15px] font-black text-slate-900">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

// Internal simple icon component for sparkels since lucide Sparkles isn't imported from main import list
function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
