"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useDiscoveryStore, Business } from "@/store/useDiscoveryStore";
import { useAuth } from "@/context/auth-context";
import { BusinessCard } from "@/components/discovery/BusinessCard";
import { ProfileDrawer } from "@/components/discovery/ProfileDrawer";
import { PromotionRequestModal } from "@/components/discovery/PromotionRequestModal";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function SavedPartnersPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  const { savedPartnerIds, toggleSavePartner } = useDiscoveryStore();
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<Business | null>(null);
  const [selectedForPromotion, setSelectedForPromotion] = useState<Business | null>(null);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/business/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedBusinesses(res.data);
      } catch (error) {
        console.error('Failed to fetch saved partners', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSaved();
  }, [token]);

  // Sync state if unsaved from this page
  const displayBusinesses = savedBusinesses.filter(b => savedPartnerIds.includes(b.id));

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-slate-900 text-[16px]">Saved Partners</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-[#1E73E8]" />
            Your Saved Partners
          </h1>
          <p className="text-[15px] text-slate-500 mt-2">
            Businesses you've bookmarked for future promotions.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[400px] animate-pulse" />
            ))}
          </div>
        ) : displayBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">No saved partners</h3>
            <p className="text-[15px] text-slate-500 max-w-[400px] text-center mb-8">
              Explore the discovery marketplace and bookmark businesses you'd like to collaborate with later.
            </p>
            <button 
              onClick={() => router.push('/businesses')}
              className="px-6 py-3 rounded-xl bg-[#1E73E8] text-white font-bold text-[14px] shadow-sm hover:bg-[#2FA7F5] transition-colors"
            >
              Find Businesses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayBusinesses.map((business) => (
              <BusinessCard 
                key={business.id}
                business={business}
                isSaved={true}
                onSaveToggle={(id) => token && toggleSavePartner(id, token)}
                onViewProfile={setSelectedProfile}
                onRequestPromotion={setSelectedForPromotion}
              />
            ))}
          </div>
        )}
      </div>

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
