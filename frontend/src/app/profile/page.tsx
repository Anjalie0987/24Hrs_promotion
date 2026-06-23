"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/api/api";
import { 
  ProfileHeader, BusinessOverview, PromotionStats, TrustAndReputation, 
  SocialLinks, BusinessBanners, RecentPromotions, PartnerNetwork, 
  ActivityTimeline, AccountInfo, QuickActions 
} from "./components";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    user: null,
    business: null,
    banners: [],
    overview: null,
    promotions: [],
    partners: [],
    topBanners: [],
    activities: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch all required data concurrently
        const [
          userRes,
          overviewRes,
          promotionsRes,
          partnersRes,
          bannersRes,
          activitiesRes
        ] = await Promise.all([
          api.get("/users/me"),
          api.get("/analytics/overview"),
          api.get("/analytics/promotions?take=5"),
          api.get("/analytics/partners"),
          api.get("/analytics/banners"),
          api.get("/analytics/activity").catch(() => ({ data: [] })) // Fallback if API missing
        ]);

        setData({
          user: userRes.data,
          business: userRes.data.business,
          banners: userRes.data.business?.banners || [],
          overview: overviewRes.data,
          promotions: promotionsRes.data.items || [],
          partners: partnersRes.data,
          topBanners: bannersRes.data,
          activities: activitiesRes.data || []
        });
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const { business, user, banners, overview, promotions, partners, activities } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Head>
        <title>My Business Profile | 24HR Status Promotion</title>
      </Head>

      {/* Sticky Mobile Back Button */}
      <div className="sticky top-[72px] md:hidden z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1200px] pt-6 md:pt-10 flex flex-col gap-6 md:gap-8">
        
        {/* Header spanning full width */}
        <ProfileHeader business={business} />

        {/* Stats Row */}
        <PromotionStats stats={overview} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Main Content Column (Left - 2/3 width on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <BusinessOverview business={business} />
            <BusinessBanners banners={banners} />
            <RecentPromotions promotions={promotions} />
            <PartnerNetwork partners={partners} />
          </div>

          {/* Sidebar Column (Right - 1/3 width on desktop) */}
          <div className="flex flex-col gap-6 md:gap-8">
            <TrustAndReputation stats={overview} />
            <QuickActions />
            <SocialLinks business={business} />
            <AccountInfo user={user} />
            <ActivityTimeline activities={activities} />
          </div>

        </div>
      </div>
    </div>
  );
}
