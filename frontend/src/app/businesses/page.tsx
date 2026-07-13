"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Bell, 
  MapPin, 
  Building2, 
  TrendingUp,
  Menu
} from "lucide-react";
import { useDiscoveryStore, Business } from "@/store/useDiscoveryStore";
import { useAuth } from "@/context/auth-context";
import { BusinessCard } from "@/components/discovery/BusinessCard";
import { FilterDrawer } from "@/components/discovery/FilterDrawer";
import { ProfileDrawer } from "@/components/discovery/ProfileDrawer";
import { PromotionRequestModal } from "@/components/discovery/PromotionRequestModal";
import { RecommendedSection } from "@/components/discovery/RecommendedSection";
import { NotificationBell } from "@/components/NotificationBell";

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const CATEGORY_PILLS = [
  "All", "Restaurant", "Retail", "Fashion", "Education", 
  "Fitness", "Real Estate", "Digital Services", "Coaching", "Startup", "Other"
];

export default function DiscoveryMarketplace() {
  const router = useRouter();
  const { token } = useAuth();
  
  const { 
    businesses, 
    savedPartnerIds, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    filters, 
    setFilters, 
    fetchBusinesses,
    fetchSavedPartners,
    toggleSavePartner
  } = useDiscoveryStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Business | null>(null);
  const [selectedForPromotion, setSelectedForPromotion] = useState<Business | null>(null);
  
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounceValue(searchInput, 500);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && token) {
        fetchBusinesses(token, false);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, fetchBusinesses, token]);

  // Initial fetch and token reaction
  useEffect(() => {
    if (token) {
      fetchSavedPartners(token);
    }
  }, [token, fetchSavedPartners]);

  // Fetch when filters or debounced search changes
  useEffect(() => {
    if (token) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (token) {
      fetchBusinesses(token, true);
    }
  }, [filters, token, fetchBusinesses]);


  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900 text-[16px]">Find Businesses</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Hero Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[28px] md:text-[36px] font-extrabold text-slate-900 tracking-tight mb-3">
            Find Your Next Promotion Partner
          </h1>
          <p className="text-[15px] md:text-[16px] text-slate-500 max-w-2xl mx-auto md:mx-0 mb-8">
            Connect with verified businesses, reach new audiences, and grow through mutual promotions.
          </p>
          

        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 sticky top-[60px] md:top-[80px] z-30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, category, or keywords..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-none text-[15px] focus:ring-2 focus:ring-[#1E73E8]/20 focus:bg-white transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Advanced Filters
          </button>
        </div>

        {/* Horizontal Category Pills */}
        <div className="flex overflow-x-auto pb-4 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide gap-2">
          {CATEGORY_PILLS.map(c => (
            <button
              key={c}
              onClick={() => setFilters({ category: c })}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[14px] font-medium transition-all border ${
                filters.category === c 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Recommended Section */}
        <RecommendedSection 
          onViewProfile={setSelectedProfile}
          onRequestPromotion={setSelectedForPromotion}
        />

        {/* Main Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-slate-900">All Businesses</h2>
        </div>

        {isLoading && businesses.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[400px] animate-pulse">
                <div className="h-32 bg-slate-200 rounded-t-2xl" />
                <div className="p-5">
                  <div className="w-16 h-16 bg-slate-300 rounded-xl -mt-10 border-4 border-white mb-4" />
                  <div className="h-5 bg-slate-200 w-3/4 rounded mb-2" />
                  <div className="h-4 bg-slate-200 w-1/4 rounded mb-6" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-slate-200 w-full rounded" />
                    <div className="h-3 bg-slate-200 w-full rounded" />
                    <div className="h-3 bg-slate-200 w-2/3 rounded" />
                  </div>
                  <div className="h-10 bg-slate-200 w-full rounded-xl mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">No matching businesses found</h3>
            <p className="text-[15px] text-slate-500 max-w-[400px] text-center mb-8">
              We couldn't find any businesses matching your exact criteria. Try adjusting your filters or category.
            </p>
            <button 
              onClick={() => { setSearchInput(''); setFilters({ category: 'All', city: '', state: '', minTrustScore: '', isVerified: false, hasWebsite: false, hasInstagram: false }); }}
              className="px-6 py-3 rounded-xl bg-[#1E73E8] text-white font-bold text-[14px] shadow-sm hover:bg-[#2FA7F5] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business, index) => {
              const isLast = index === businesses.length - 1;
              return (
                <div key={business.id} ref={isLast ? lastElementRef : null}>
                  <BusinessCard 
                    business={business}
                    isSaved={savedPartnerIds.includes(business.id)}
                    onSaveToggle={(id) => token && toggleSavePartner(id, token)}
                    onViewProfile={setSelectedProfile}
                    onRequestPromotion={setSelectedForPromotion}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-100" />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

      </div>

      {/* Drawers & Modals */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      
      <ProfileDrawer 
        isOpen={!!selectedProfile} 
        onClose={() => setSelectedProfile(null)} 
        business={selectedProfile}
        onRequestPromotion={setSelectedForPromotion}
      />
      
      <PromotionRequestModal 
        isOpen={!!selectedForPromotion} 
        onClose={() => setSelectedForPromotion(null)} 
        business={selectedForPromotion}
      />
    </div>
  );
}
