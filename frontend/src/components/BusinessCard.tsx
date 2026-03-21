"use client";

import React from 'react';
import { MapPin, Tag, ArrowRight, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category: string;
    location: string | null;
    logoUrl: string | null;
    description?: string;
    matchScore?: number;
    trustScore?: number;
    bannerUrl?: string; // Unified banner URL
    banners?: { imageUrl: string }[]; // Fallback for existing structure
  };
  onSendRequest: (businessId: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onSendRequest }) => {
  const banner = business.bannerUrl || business.banners?.[0]?.imageUrl;
  const hasHighMatch = business.matchScore && business.matchScore >= 70;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
    >
      {/* Banner Segment (16:9) */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-50">
        {banner ? (
          <Image 
            src={banner} 
            alt={business.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Match Score Badge (Top Right) */}
        {business.matchScore !== undefined && (
          <div className={cn(
            "absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-lg animate-in fade-in zoom-in duration-500",
            hasHighMatch 
              ? "bg-blue-600/90 border-blue-400 text-white" 
              : "bg-white/90 border-slate-200 text-slate-800"
          )}>
            <Sparkles className={cn("w-3 h-3", hasHighMatch ? "text-blue-200 fill-blue-200" : "text-blue-500")} />
            <span className="text-[10px] font-black uppercase tracking-tight">{business.matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Content Segment */}
      <div className="relative px-6 pb-6 flex-1 flex flex-col">
        {/* Overlapping Logo - Compact */}
        <div className="absolute -top-8 left-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white p-1 shadow-xl ring-4 ring-white group-hover:ring-blue-50 transition-all duration-500">
            <div className="w-full h-full rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden relative">
              {business.logoUrl ? (
                <Image src={business.logoUrl} alt={business.name} fill className="object-cover" />
              ) : (
                <span className="text-2xl font-black text-blue-600/20">{business.name.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="mt-10 space-y-3 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider ring-1 ring-blue-600/10">
                {business.category}
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-black uppercase tracking-wider ring-1 ring-amber-600/10">
                <Star className="w-2 h-2 fill-amber-500 border-none" />
                <span>{business.trustScore || 50}%</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {business.name}
            </h3>
            {business.location && (
              <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{business.location}</span>
              </div>
            )}
          </div>

          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
            {business.description || `Helping ${business.category} businesses grow through daily status promotions and network collaboration.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSendRequest(business.id)}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Promotion 🚀
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </motion.button>
          
          <button className="w-full h-10 text-slate-500 text-[11px] font-black hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100 flex items-center justify-center gap-1.5 group/more">
            View Full Profile
            <ArrowRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
