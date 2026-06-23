"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, MapPin, Building2, CheckCircle2, Globe, Instagram, Star } from "lucide-react";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All", "Restaurant", "Retail", "Fashion", "Education", 
  "Fitness", "Real Estate", "Digital Services", "Coaching", "Startup", "Other"
];

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { filters, setFilters, resetFilters } = useDiscoveryStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#1E73E8]" />
                <h2 className="text-[18px] font-bold text-slate-800">Advanced Filters</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-3">
                  <Building2 className="w-4 h-4 text-slate-400" /> Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setFilters({ category: c })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors border",
                        filters.category === c 
                          ? "bg-[#1E73E8] text-white border-[#1E73E8]" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-3">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => setFilters({ city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8]"
                  />
                  <input 
                    type="text" 
                    placeholder="State"
                    value={filters.state}
                    onChange={(e) => setFilters({ state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8]"
                  />
                </div>
              </div>

              {/* Trust Score */}
              <div>
                <label className="flex items-center justify-between text-[14px] font-semibold text-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-400" /> Minimum Trust Score
                  </div>
                  <span className="text-[#1E73E8]">{filters.minTrustScore || 0}%</span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={filters.minTrustScore || 0}
                  onChange={(e) => setFilters({ minTrustScore: e.target.value })}
                  className="w-full accent-[#1E73E8]"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-slate-800">Verified Only</div>
                      <div className="text-[12px] text-slate-500">Show only verified businesses</div>
                    </div>
                  </div>
                  <div className={cn("w-10 h-6 rounded-full transition-colors relative", filters.isVerified ? "bg-[#1E73E8]" : "bg-slate-200")}>
                    <input type="checkbox" className="sr-only" checked={filters.isVerified} onChange={(e) => setFilters({ isVerified: e.target.checked })} />
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", filters.isVerified ? "left-5" : "left-1")} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-slate-800">Has Website</div>
                      <div className="text-[12px] text-slate-500">Must have a website link</div>
                    </div>
                  </div>
                  <div className={cn("w-10 h-6 rounded-full transition-colors relative", filters.hasWebsite ? "bg-[#1E73E8]" : "bg-slate-200")}>
                    <input type="checkbox" className="sr-only" checked={filters.hasWebsite} onChange={(e) => setFilters({ hasWebsite: e.target.checked })} />
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", filters.hasWebsite ? "left-5" : "left-1")} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-slate-800">Has Instagram</div>
                      <div className="text-[12px] text-slate-500">Must have an IG profile</div>
                    </div>
                  </div>
                  <div className={cn("w-10 h-6 rounded-full transition-colors relative", filters.hasInstagram ? "bg-[#1E73E8]" : "bg-slate-200")}>
                    <input type="checkbox" className="sr-only" checked={filters.hasInstagram} onChange={(e) => setFilters({ hasInstagram: e.target.checked })} />
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", filters.hasInstagram ? "left-5" : "left-1")} />
                  </div>
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#1E73E8] text-white font-semibold text-[14px] hover:bg-[#2FA7F5] shadow-sm transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
