"use client";

import { useEffect } from "react";
import { Sparkles, Info } from "lucide-react";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";
import { useAuth } from "@/context/auth-context";
import { BusinessCard } from "./BusinessCard";

interface RecommendedSectionProps {
  onViewProfile: (b: any) => void;
  onRequestPromotion: (b: any) => void;
}

export function RecommendedSection({ onViewProfile, onRequestPromotion }: RecommendedSectionProps) {
  const { token } = useAuth();
  const { recommended, fetchRecommended, savedPartnerIds, toggleSavePartner } = useDiscoveryStore();

  useEffect(() => {
    if (token) {
      fetchRecommended(token);
    }
  }, [token, fetchRecommended]);

  if (!recommended || recommended.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Recommended For You
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            AI matched based on your business category and location.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommended.slice(0, 4).map((business) => (
          <div key={business.id} className="relative group/tooltip">
            <BusinessCard 
              business={business}
              isSaved={savedPartnerIds.includes(business.id)}
              onSaveToggle={(id) => token && toggleSavePartner(id, token)}
              onViewProfile={onViewProfile}
              onRequestPromotion={onRequestPromotion}
            />
            {/* Tooltip for Match Reason */}
            {business.matchReason && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-slate-900 text-white text-[12px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-purple-400" />
                  {business.matchReason}
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
