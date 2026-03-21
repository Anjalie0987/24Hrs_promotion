"use client";

import { useState, useEffect } from "react";
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
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { getMyBusiness } from "@/api/business.api";
import { getMyBanners } from "@/api/banner.api";
import { getIncomingRequests, acceptRequest, rejectRequest } from "@/api/request.api";
import { getActivePromotions, getAllPromotions } from "@/api/promotion.api";
import { RequestCard } from "@/components/RequestCard";
import { PromotionCard } from "@/components/PromotionCard";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
    const { user } = useAuth();
    const [business, setBusiness] = useState<any>(null);
    const [banners, setBanners] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [activePromotions, setActivePromotions] = useState<any[]>([]);
    const [allPromotions, setAllPromotions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    const fetchData = async () => {
        try {
            setError(null);
            const [bizData, bannersData, requestsData, activePromosData, allPromosData] = await Promise.all([
                getMyBusiness(),
                getMyBanners(),
                getIncomingRequests(),
                getActivePromotions(),
                getAllPromotions()
            ]);
            setBusiness(bizData);
            setBanners(bannersData);
            setRequests(requestsData);
            setActivePromotions(activePromosData);
            setAllPromotions(allPromosData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAcceptRequest = async (id: string) => {
        try {
            setIsActionLoading(true);
            await acceptRequest(id);
            toast.success("Request accepted and promotion started!");
            fetchData();
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
            fetchData();
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
                <p className="text-slate-500 mb-6">{error}</p>
                <button 
                    onClick={() => { setIsLoading(true); fetchData(); }}
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
                        You're almost there. To start promoting and getting featured, you need to set up your business profile first.
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

    const stats = [
        { 
            label: "Total Promotions", 
            value: allPromotions.length.toString(), 
            icon: Megaphone, 
            color: "text-blue-600", 
            bg: "bg-blue-100" 
        },
        { 
            label: "Banner Downloads", 
            value: "0", 
            icon: DownloadCloud, 
            color: "text-purple-600", 
            bg: "bg-purple-100" 
        },
        { 
            label: "Clicks Generated", 
            value: "0", 
            icon: MousePointer2, 
            color: "text-emerald-600", 
            bg: "bg-emerald-100" 
        },
        { 
            label: "Trust Score", 
            value: `${business.trustScore || 50}%`, 
            icon: ShieldCheck, 
            color: "text-amber-600", 
            bg: "bg-amber-100" 
        },
    ];

    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    return (
        <ProtectedRoute>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Welcome, {user?.firstName || 'Business Owner'}!</h1>
                    <p className="text-[#64748B]">Here's how {business?.name} ({business?.category}) is performing today.</p>
                </div>

            {/* Active Promotions Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-[#0F172A]">Active Promotions ({activePromotions.length})</h2>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {activePromotions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-10 border border-slate-200 border-dashed flex flex-col items-center text-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Megaphone className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">No active promotions.</h3>
                        <p className="text-[#64748B] mb-8 max-w-sm">Find partners to start cross-promoting and boost your visibility!</p>
                        <Link
                            href="/find-businesses"
                            className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Store className="w-5 h-5" />
                            <span>Find Partners</span>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {activePromotions.map((promo) => (
                            <PromotionCard 
                                key={promo.id} 
                                promotion={promo} 
                                currentBusinessId={business?.id}
                                onUpdate={fetchData}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm font-medium text-[#64748B] mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-[#0F172A]">{stat.value}</h4>
                        </div>
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                    </motion.div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* My Banners Section */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                                <UploadIcon className="w-5 h-5 text-blue-500" />
                                My Banners ({banners.length})
                            </h3>
                            <Link href="/my-banners" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {banners.length === 0 ? (
                            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="text-slate-400 text-sm mb-4">No banners uploaded yet</p>
                                <Link 
                                    href="/my-banners"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Upload Now
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {banners.slice(0, 3).map((banner) => (
                                    <div key={banner.id} className="relative aspect-[9/16] rounded-xl overflow-hidden group">
                                        <Image src={banner.imageUrl} alt={banner.title || "Banner"} fill className="object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    </div>
                                ))}
                                {banners.length > 3 && (
                                    <Link 
                                        href="/my-banners"
                                        className="aspect-[9/16] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group"
                                    >
                                        <span className="text-xl font-bold">+{banners.length - 3}</span>
                                        <span className="text-xs font-bold uppercase tracking-tighter">More</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Recent Requests Section */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                                <InboxIcon className="w-5 h-5 text-blue-500" />
                                Recent Incoming Requests ({pendingRequests.length})
                            </h3>
                            <Link href="/requests" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {pendingRequests.length === 0 ? (
                            <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-xl">
                                <p className="text-slate-400 text-sm">No new requests</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingRequests
                                    .slice(0, 3)
                                    .map((request) => (
                                        <RequestCard 
                                            key={request.id} 
                                            request={request} 
                                            type="incoming"
                                            onAccept={handleAcceptRequest}
                                            onReject={handleRejectRequest}
                                            isLoading={isActionLoading}
                                        />
                                    ))
                                }
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Quick Actions Column */}
                <div className="lg:col-span-1">
                    {/* Quick Actions */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-blue-500" />
                            Quick Actions
                        </h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Edit Business", icon: Store, href: "/profile-setup" },
                                { label: "Requests", icon: Megaphone, href: "/requests" },
                                { label: "Find Partners", icon: Store, href: "/businesses" },
                                { label: "Banners", icon: UploadIcon, href: "/my-banners" }
                            ].map((action, idx) => (
                                <Link
                                    key={idx}
                                    href={action.href}
                                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#2563EB] hover:bg-blue-50 group transition-all"
                                >
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
                    </section>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
