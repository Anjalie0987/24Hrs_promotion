"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Instagram, 
  Award, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck,
  TrendingUp,
  Percent
} from "lucide-react";
import { Business } from "@/store/useDiscoveryStore";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  business: Business;
  isSaved: boolean;
  onSaveToggle: (id: string) => void;
  onViewProfile: (business: Business) => void;
  onRequestPromotion: (business: Business) => void;
}

export function BusinessCard({ 
  business, 
  isSaved, 
  onSaveToggle, 
  onViewProfile,
  onRequestPromotion
}: BusinessCardProps) {
  
  const getRequestButtonState = () => {
    switch (business.requestStatus) {
      case 'PENDING': return { text: 'Request Sent', disabled: true, className: 'bg-slate-100 text-slate-500' };
      case 'ACTIVE': return { text: 'Promotion Active', disabled: true, className: 'bg-emerald-50 text-emerald-600 border border-emerald-200' };
      case 'COMPLETED': return { text: 'Start Another Promotion', disabled: false, className: 'bg-[#1E73E8] text-white hover:bg-[#2FA7F5]' };
      case 'REJECTED': return { text: 'Request Declined', disabled: true, className: 'bg-red-50 text-red-500 border border-red-200' };
      default: return { text: 'Start Promotion', disabled: false, className: 'bg-[#1E73E8] text-white hover:bg-[#2FA7F5]' };
    }
  };

  const btnState = getRequestButtonState();

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#1E73E8]/30 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Banner */}
      <div className="h-32 bg-slate-100 relative overflow-hidden shrink-0">
        {business.bannerUrl ? (
          <img 
            src={business.bannerUrl} 
            alt="Banner" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E73E8]/10 to-[#2FA7F5]/20 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-[#1E73E8]/20" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-[11px] font-semibold">
          {business.isAvailable ? (
            <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-emerald-700">Available</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-red-700">Busy</span></>
          )}
        </div>

        {/* Save Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onSaveToggle(business.id); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-slate-500 hover:text-[#1E73E8] transition-colors"
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#1E73E8]" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Header (Logo + Title) */}
        <div className="flex gap-4 -mt-10 mb-4 relative z-10">
          <div className="w-16 h-16 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>
          
          <div className="pt-8 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-bold text-slate-900 text-[16px] truncate">{business.name}</h3>
              {business.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[#1E73E8] shrink-0" />
              )}
            </div>
            <p className="text-[13px] font-medium text-[#1E73E8] bg-[#EEF5FF] w-fit px-2 py-0.5 rounded-md truncate">
              {business.category}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {(business.city || business.state) && (
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{business.city}{business.city && business.state ? ', ' : ''}{business.state}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Trust Score: <strong className="text-slate-900">{business.trustScore}%</strong></span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-slate-500 line-clamp-2 mb-5 leading-relaxed flex-1">
          {business.description || "No description provided."}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Completed</div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[14px] font-bold text-slate-800">{business.metrics?.completedPromotions || 0}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Success</div>
            <div className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#1E73E8]" />
              <span className="text-[14px] font-bold text-slate-800">{business.metrics?.successRate || 100}%</span>
            </div>
          </div>
        </div>

        {/* Socials & Actions */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {business.website && (
              <a href={business.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-[#1E73E8] hover:bg-slate-50 rounded-lg transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {business.instagram && (
              <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-[#E1306C] hover:bg-slate-50 rounded-lg transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
          <button 
            onClick={() => onViewProfile(business)}
            className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Primary Action */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => onRequestPromotion(business)}
          disabled={btnState.disabled || !business.isAvailable}
          className={cn(
            "w-full py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all",
            !business.isAvailable && !btnState.disabled ? "bg-slate-100 text-slate-400" : btnState.className
          )}
        >
          {btnState.text}
        </button>
      </div>

      {/* Match Badge */}
      {business.matchScore && business.matchScore > 0 && (
        <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-1.5 animate-in slide-in-from-top-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {business.matchScore}% Match
          </div>
        </div>
      )}
    </motion.div>
  );
}
