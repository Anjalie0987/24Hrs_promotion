"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Megaphone,
    Upload as UploadIcon,
    ArrowRight,
    BarChart3,
    DownloadCloud,
    MousePointer2,
    ShieldCheck,
    PlusCircle,
    Store,
    Loader2,
    Inbox as InboxIcon,
    AlertCircle,
    ScanLine,
    Activity,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { getDashboardSummary } from "@/api/analytics.api";
import { acceptRequest, rejectRequest } from "@/api/request.api";
import { RequestCard } from "@/components/RequestCard";
import { PromotionCard } from "@/components/PromotionCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: summaryData, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: getDashboardSummary,
    });

    const business = summaryData?.business;
    const banners = summaryData?.banners || [];
    const requests = summaryData?.requests || [];
    const activePromotions = summaryData?.activePromotions || [];
    const overview = summaryData?.overview;
    const chartData = summaryData?.chart || [];
    const topPartners = summaryData?.topPartners || [];
    const topBanners = summaryData?.topBanners || [];
    const [isActionLoading, setIsActionLoading] = useState(false);
    const handleAcceptRequest = async (id: string) => {
        try {
            setIsActionLoading(true);
            await acceptRequest(id);
            toast.success("Request accepted and promotion started!");
            refetch();
        } catch (error) {
            toast.error("Failed to accept request");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRejectRequest = async (id: string) => {
        try {
            setIsActionLoading(true);
            await rejectRequest(id);
            toast.success("Request rejected");
            refetch();
        } catch (error) {
            toast.error("Failed to reject request");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-rose-50 rounded-3xl border border-rose-100">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-slate-500 mb-6">{error instanceof Error ? error.message : "Failed to load dashboard data."}</p>
                <button 
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all shadow-sm"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (!business) {
        return (
            <ProtectedRoute>
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <Store className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to 24-Hr Promotion!</h2>
                    <p className="text-slate-500 max-w-md mb-8">
                        To start promoting and getting featured, you need to set up your business profile first.
                    </p>
                    <Link
                        href="/profile-setup"
                        className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
                    >
                        <span>Complete Profile Setup</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </ProtectedRoute>
        );
    }

    const pendingRequests = requests.filter((r: any) => r.status === 'PENDING');

    const kpis = [
        { label: "Total Promotions", value: overview?.totalPromotions || 0, icon: Megaphone, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Active Promotions", value: overview?.activePromotions || 0, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-100" },
        { label: "Completed Promotions", value: overview?.completedPromotions || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Completion Rate", value: `${overview?.completionRate || 0}%`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Total Clicks", value: overview?.totalClicks || 0, icon: MousePointer2, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "Banner Downloads", value: overview?.totalBannerDownloads || 0, icon: DownloadCloud, color: "text-pink-600", bg: "bg-pink-100" },
        { label: "Trust Score", value: `${overview?.trustScore || 50}`, icon: ShieldCheck, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    return (
        <ProtectedRoute>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Dashboard Hub</h1>
                        <p className="text-[#64748B]">Welcome back, {user?.firstName}. Here is {business?.name}'s current performance.</p>
                    </div>
                    <Link href="/analytics" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 w-fit">
                        <BarChart3 className="w-4 h-4" />
                        Deep Analytics
                    </Link>
                </div>

                {/* Section 1: KPI Cards */}
                <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {kpis.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-[#0F172A]">{stat.value}</h4>
                                <p className="text-xs font-medium text-[#64748B] line-clamp-1">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Section 2: Active / Pending / Quick Actions */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Promotions */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#0F172A]">Active Promotions ({activePromotions.length})</h2>
                            <div className="h-px flex-1 bg-slate-200 ml-4 hidden sm:block" />
                        </div>
                        {activePromotions.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 border-dashed flex flex-col items-center text-center shadow-sm">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <Megaphone className="w-6 h-6 text-[#2563EB]" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0F172A] mb-1">No active promotions</h3>
                                <p className="text-[#64748B] text-sm mb-6 max-w-sm">Find partners to start cross-promoting and boost your visibility!</p>
                                <Link href="/find-businesses" className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all">
                                    Find Partners
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {activePromotions.map((promo: any) => (
                                    <PromotionCard key={promo.id} promotion={promo} currentBusinessId={business?.id} onUpdate={refetch} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Pending Requests */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                                    <InboxIcon className="w-5 h-5 text-blue-500" />
                                    Incoming ({pendingRequests.length})
                                </h3>
                                <Link href="/promotion-requests" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</Link>
                            </div>
                            {pendingRequests.length === 0 ? (
                                <div className="py-6 text-center border-2 border-dashed border-slate-50 rounded-xl">
                                    <p className="text-slate-400 text-sm">No new requests</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingRequests.slice(0, 2).map((request: any) => (
                                        <RequestCard key={request.id} request={request} type="incoming" onAccept={handleAcceptRequest} onReject={handleRejectRequest} isLoading={isActionLoading} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-emerald-500" />
                                Quick Actions
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { label: "My Banners", icon: UploadIcon, href: "/my-banners" },
                                    { label: "Edit Business", icon: Store, href: "/profile-setup" },
                                ].map((action, idx) => (
                                    <Link key={idx} href={action.href} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#2563EB] hover:bg-blue-50 group transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <action.icon className="w-4 h-4 text-slate-600 group-hover:text-[#2563EB] transition-colors" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#2563EB]">{action.label}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Analytics Overview Chart */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-[#0F172A]">Engagement Overview</h2>
                            <p className="text-sm text-[#64748B]">Clicks over the last 30 days.</p>
                        </div>
                    </div>
                    <AnalyticsChart data={chartData} />
                </section>

                {/* Section 4: Top Partners and Banners */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Partners */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[#0F172A]">Top Performing Partners</h3>
                        </div>
                        {topPartners.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4 text-center">No partner data yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {topPartners.map((partner: any, idx: number) => (
                                    <div key={partner.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-slate-300 w-4">{idx + 1}</div>
                                            {partner.logoUrl ? (
                                                <Image src={partner.logoUrl} alt={partner.name} width={40} height={40} className="rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <Store className="w-5 h-5 text-slate-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-[#0F172A]">{partner.name}</p>
                                                <p className="text-xs text-[#64748B]">{partner.totalPromotions} promotions • {partner.completionRate}% completion</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">{partner.totalClicks}</p>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Clicks</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Banners */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[#0F172A]">Top Performing Banners</h3>
                        </div>
                        {topBanners.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4 text-center">No banner data yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {topBanners.map((banner: any, idx: number) => (
                                    <div key={banner.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-slate-300 w-4">{idx + 1}</div>
                                            <Image src={banner.imageUrl} alt={banner.title || "Banner"} width={28} height={50} className="rounded object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-[#0F172A]">{banner.title || 'Untitled'}</p>
                                                <p className="text-xs text-[#64748B]">Used in {banner.promotionCount} active promotions</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <p className="text-sm font-bold text-emerald-600">{banner.scans}</p>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Scans</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-blue-600">{banner.clicks}</p>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Clicks</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}
