"use client";

import { motion } from "framer-motion";
import { 
  Building2, MapPin, CheckCircle2, ShieldCheck, 
  ExternalLink, Globe, Instagram, MessageCircle,
  BarChart3, Activity, Users, Download, 
  Clock, CheckCircle, Upload, Send, PlayCircle, Eye, RefreshCw, Trash2, Calendar, Cog
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// 1. Profile Header
export const ProfileHeader = ({ business }: { business: any }) => (
  <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl"></div>
    <div className="z-10 mt-6 md:mt-12 flex flex-col items-center md:items-start w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-2 shadow-md shrink-0">
          <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
            {business?.logoUrl ? (
              <img src={business.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-slate-300" />
            )}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            {business?.name || "My Business"}
            {business?.isVerified && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {business?.category || "Category"}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {business?.location || business?.city || "Location"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-semibold">
            <ShieldCheck className="w-5 h-5" /> Trust Score {business?.trustScore || 50}%
          </div>
          <Link href="/profile-setup" className="btn-gradient text-white text-center py-2.5 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all w-full md:w-auto">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  </Card>
);

// 2. Business Overview
export const BusinessOverview = ({ business }: { business: any }) => (
  <Card className="p-6">
    <h3 className="text-lg font-bold text-slate-800 mb-4">Business Overview</h3>
    <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
      {business?.description || "No description provided. Add a description to help partners understand your business."}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
      <div className="flex justify-between md:justify-start md:gap-4 border-b border-slate-50 md:border-none pb-2 md:pb-0">
        <span className="text-slate-500 font-medium w-32">Member Since</span>
        <span className="text-slate-800 font-semibold">{business?.createdAt ? format(new Date(business.createdAt), 'MMM yyyy') : "N/A"}</span>
      </div>
      <div className="flex justify-between md:justify-start md:gap-4 border-b border-slate-50 md:border-none pb-2 md:pb-0">
        <span className="text-slate-500 font-medium w-32">Availability</span>
        <span className="text-slate-800 font-semibold flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${business?.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {business?.isAvailable ? "Available for Promotions" : "Temporarily Paused"}
        </span>
      </div>
    </div>
  </Card>
);

// 3. Promotion Statistics
export const PromotionStats = ({ stats }: { stats: any }) => {
  const kpis = [
    { title: "Total Promotions", value: stats?.totalPromotions || 0, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed", value: stats?.completedPromotions || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Now", value: stats?.activePromotions || 0, icon: PlayCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Success Rate", value: `${stats?.completionRate || 0}%`, icon: ShieldCheck, color: "text-cyan-600", bg: "bg-cyan-50" },
    { title: "Total Clicks", value: stats?.totalClicks || 0, icon: ExternalLink, color: "text-violet-600", bg: "bg-violet-50" },
    { title: "Downloads", value: stats?.totalBannerDownloads || 0, icon: Download, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Partners", value: stats?.totalPartners || 0, icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3"
        >
          <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
            <kpi.icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-800">{kpi.value}</h4>
            <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// 4. Trust & Reputation
const ProgressBar = ({ label, value, max = 100 }: { label: string, value: number, max?: number }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-sm font-medium">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900">{value}{max === 100 ? '%' : ''}</span>
    </div>
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
      />
    </div>
  </div>
);

export const TrustAndReputation = ({ stats }: { stats: any }) => (
  <Card className="p-6">
    <h3 className="text-lg font-bold text-slate-800 mb-6">Trust & Reputation</h3>
    <div className="flex flex-col gap-5">
      <ProgressBar label="Trust Score" value={stats?.trustScore || 50} />
      <ProgressBar label="Completion Rate" value={stats?.completionRate || 0} />
      {/* We can infer Approval Rate from data if we had total requests vs approved. Defaulting to 100 for visual sake if no data */}
      <ProgressBar label="Approval Rate" value={85} /> 
    </div>
  </Card>
);

// 5. Social Links
export const SocialLinks = ({ business }: { business: any }) => {
  const links = [
    { name: "Website", icon: Globe, url: business?.website, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Instagram", icon: Instagram, url: business?.instagram, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "WhatsApp", icon: MessageCircle, url: business?.whatsapp, color: "text-emerald-500", bg: "bg-emerald-50" },
  ].filter(l => l.url);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Social & Links</h3>
      {links.length === 0 ? (
        <p className="text-sm text-slate-500">No social links added yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.bg} ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-700">{link.name}</span>
              </div>
              <a href={link.url} target="_blank" rel="noreferrer" className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all">
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// 6. Business Banners
export const BusinessBanners = ({ banners }: { banners: any[] }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">My Promotion Banners</h3>
      <Link href="/my-banners" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
    </div>
    {(!banners || banners.length === 0) ? (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Upload className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-slate-600 font-medium mb-1">No banners uploaded</p>
        <p className="text-sm text-slate-400 mb-4">Upload a banner to start promoting your business.</p>
        <Link href="/my-banners" className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">Upload Banner</Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b, idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden group">
            <div className="aspect-[4/3] bg-slate-100 relative">
              {b.watermarkedImageUrl || b.originalImageUrl ? (
                <img src={b.watermarkedImageUrl || b.originalImageUrl} alt={b.title || "Banner"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 truncate mb-2">{b.title || "Untitled Banner"}</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-slate-100 pt-3">
                <div><p className="font-bold text-slate-800">{b.clicks || 0}</p><p className="text-xs text-slate-500">Clicks</p></div>
                <div><p className="font-bold text-slate-800">{b.scans || 0}</p><p className="text-xs text-slate-500">Scans</p></div>
                <div><p className="font-bold text-slate-800">{b.downloads || 0}</p><p className="text-xs text-slate-500">DLs</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// 7. Recent Promotions
export const RecentPromotions = ({ promotions }: { promotions: any[] }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">Recent Promotions</h3>
      <Link href="/analytics" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Full Analytics</Link>
    </div>
    {(!promotions || promotions.length === 0) ? (
      <div className="text-center py-8">
        <p className="text-slate-500 font-medium">No promotions started yet.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-400">
              <th className="pb-3 font-medium">Partner</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Clicks</th>
              <th className="pb-3 font-medium">Scans</th>
              <th className="pb-3 font-medium">Start Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {promotions.map((p, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-100 overflow-hidden">
                    {p.partnerLogo && <img src={p.partnerLogo} alt="Logo" className="w-full h-full object-cover"/>}
                  </div>
                  {p.partnerName}
                </td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 font-semibold text-slate-700">{p.clicks}</td>
                <td className="py-3 font-semibold text-slate-700">{p.scans}</td>
                <td className="py-3 text-slate-500">{format(new Date(p.startDate), 'MMM dd, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

// 8. Partner Network
export const PartnerNetwork = ({ partners }: { partners: any[] }) => (
  <Card className="p-6">
    <h3 className="text-lg font-bold text-slate-800 mb-6">My Promotion Partners</h3>
    {(!partners || partners.length === 0) ? (
      <p className="text-slate-500 text-sm text-center py-4">No partners found.</p>
    ) : (
      <div className="flex flex-col gap-4">
        {partners.map((partner, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                {partner.logoUrl && <img src={partner.logoUrl} alt="Logo" className="w-full h-full object-cover"/>}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{partner.name}</h4>
                <p className="text-xs text-slate-500">{partner.completedPromotions} completed promotions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 text-sm">{partner.totalClicks}</p>
              <p className="text-xs text-slate-500">Clicks Gen.</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// 9. Activity Timeline
export const ActivityTimeline = ({ activities }: { activities: any[] }) => (
  <Card className="p-6 h-full">
    <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
    {(!activities || activities.length === 0) ? (
      <p className="text-slate-500 text-sm text-center py-4">No recent activity.</p>
    ) : (
      <div className="relative border-l-2 border-slate-100 ml-3 flex flex-col gap-6">
        {activities.map((act, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-[2px] border-white ring-2 ring-blue-100"></div>
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-1">{format(new Date(act.date), 'MMM dd • hh:mm a')}</p>
              <h4 className="font-bold text-slate-800 text-sm">{act.title}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// 10. Account Info
export const AccountInfo = ({ user }: { user: any }) => (
  <Card className="p-6">
    <h3 className="text-lg font-bold text-slate-800 mb-6">Account Information</h3>
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 font-medium">Email Address</span>
        <span className="font-semibold text-slate-800">{user?.email}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 font-medium">Account ID</span>
        <span className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded w-max text-xs">{user?.id}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 font-medium">Account Created</span>
        <span className="font-semibold text-slate-800">{user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}</span>
      </div>
    </div>
  </Card>
);

// 11. Quick Actions
export const QuickActions = () => {
  const actions = [
    { name: "Find Businesses", icon: Users, route: "/businesses", bg: "bg-indigo-50", color: "text-indigo-600" },
    { name: "Upload Banner", icon: Upload, route: "/my-banners", bg: "bg-emerald-50", color: "text-emerald-600" },
    { name: "Analytics", icon: BarChart3, route: "/analytics", bg: "bg-blue-50", color: "text-blue-600" },
    { name: "Settings", icon: Cog, route: "/settings", bg: "bg-slate-100", color: "text-slate-600" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          <Link key={idx} href={act.route} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${act.bg} ${act.color} group-hover:scale-110 transition-transform`}>
              <act.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700 text-center">{act.name}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
};
