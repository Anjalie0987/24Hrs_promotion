"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, Sparkles, MapPin, Tag, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBusinesses, getRecommendedBusinesses } from '@/api/business.api';
import { BusinessCard } from '@/components/BusinessCard';
import { BannerSelectModal } from '@/components/BannerSelectModal';
import { sendRequest } from '@/api/request.api';
import { toast } from 'react-hot-toast';
import { useDebounce } from '@/hooks/use-debounce';
import ProtectedRoute from "@/components/protected-route";
import { cn } from "@/lib/utils";

const CATEGORIES = ['All', 'Restaurant', 'Fashion', 'Retail', 'Electronics', 'Services', 'Other'];

export default function FindBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedLocation = useDebounce(location, 300);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [debouncedSearch, category, debouncedLocation]);

  const fetchInitialData = async () => {
    try {
      const recs = await getRecommendedBusinesses();
      setRecommended(recs);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await getBusinesses({
        search: debouncedSearch,
        category: category !== 'All' ? category : undefined,
        location: debouncedLocation
      });
      setBusinesses(data);
    } catch (error) {
      console.error('Failed to fetch businesses', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = (businessId: string) => {
    const business = [...businesses, ...recommended].find(b => b.id === businessId);
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleConfirmRequest = async (bannerId: string) => {
    if (!selectedBusiness) return;
    
    try {
      setIsSending(true);
      await sendRequest({
        receiverBusinessId: selectedBusiness.id,
        bannerId
      });
      toast.success(`Request sent to ${selectedBusiness.name}!`);
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 -mt-8">
        {/* Premium Header Section - Refined */}
        <div className="relative overflow-hidden mb-12 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/30">
          {/* Background Glows - Subtler */}
          <div className="absolute top-0 right-0 w-[30%] h-[120%] bg-blue-50/30 blur-[100px] -rotate-12 translate-x-1/3 -z-10" />
          <div className="absolute bottom-0 left-0 w-[20%] h-[80%] bg-indigo-50/20 blur-[80px] -z-10" />
          
          <div className="max-w-7xl mx-auto pt-16 pb-12 px-10 relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/5 text-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 fill-blue-600/10" />
                  <span>Partners Discovery</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Find Your Next <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Promotion Partner
                  </span>
                </h1>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-lg">
                  Connect with curated local businesses to swap status promotions and grow your organic audience together.
                </p>
              </div>

              {/* Action Bar / Filters - Compact */}
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-72 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search business..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 rounded-[20px] bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-slate-900 font-bold shadow-sm"
                    />
                  </div>
                  <div className="relative w-full sm:w-56 group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 rounded-[20px] bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-slate-900 font-bold shadow-sm"
                    />
                  </div>
                </div>

                {/* Category Pills - Refined */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <div className="flex items-center gap-2 text-slate-300 pr-1">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl text-[12px] font-black transition-all whitespace-nowrap border shadow-sm",
                        category === cat
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                          : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-24">
          {/* Recommendations Segment */}
          {recommended.length > 0 && !debouncedSearch && category === 'All' && !debouncedLocation && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                    🔥 Recommended for You
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-tighter animate-pulse shadow-lg shadow-blue-500/30">
                      LIVE MATCHING
                    </span>
                  </h2>
                  <p className="text-slate-500 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    Artificial Intelligence generated the best matches for your business model.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recommended.map((business) => (
                  <BusinessCard 
                    key={`rec-${business.id}`} 
                    business={business} 
                    onSendRequest={handleSendRequest}
                  />
                ))}
              </div>
              
              <div className="mt-20 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />
            </motion.section>
          )}

          {/* Main Discovery Segment */}
          <section className="px-4 pb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                {debouncedSearch || category !== 'All' || debouncedLocation ? 'Discovery Results' : 'All Network Partners'}
                <span className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-lg">
                  {businesses.length}
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-2 h-[450px] animate-pulse">
                    <div className="aspect-[16/9] bg-slate-100 rounded-[28px] mb-8" />
                    <div className="px-6 space-y-5">
                      <div className="h-4 w-1/4 bg-slate-100 rounded-lg" />
                      <div className="h-8 w-2/3 bg-slate-100 rounded-xl" />
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-slate-50 rounded-lg" />
                        <div className="h-4 w-4/5 bg-slate-50 rounded-lg" />
                      </div>
                      <div className="h-14 w-full bg-slate-50 rounded-2xl mt-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {businesses.map((business) => (
                  <BusinessCard 
                    key={business.id} 
                    business={business} 
                    onSendRequest={handleSendRequest}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[56px] border-2 border-dashed border-slate-200 shadow-inner">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-slate-100">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No businesses found</h3>
                <p className="text-slate-500 font-bold max-w-sm text-center leading-relaxed">
                  We couldn't find any partners matching your criteria. Try adjusting your filters or search terms!
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSearchQuery(''); setCategory('All'); setLocation(''); }}
                  className="mt-12 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-3"
                >
                  <Filter className="w-5 h-5" />
                  Reset Discovery Hub
                </motion.button>
              </div>
            )}
          </section>
        </div>

        <AnimatePresence>
          {isModalOpen && selectedBusiness && (
            <BannerSelectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleConfirmRequest}
              receiverName={selectedBusiness.name}
              isLoading={isSending}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
