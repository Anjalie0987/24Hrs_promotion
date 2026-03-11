"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Megaphone,
    Download,
    Upload as UploadIcon,
    CheckCircle2,
    Clock,
    Users,
    ArrowRight,
    BarChart3,
    DownloadCloud,
    MousePointer2,
    ShieldCheck,
    PlusCircle,
    Eye,
    Check,
    X,
    ExternalLink,
    Store,
    LayoutDashboard,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const stats = [
    { label: "Total Promotions", value: "24", icon: Megaphone, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Banner Downloads", value: "142", icon: DownloadCloud, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Clicks Generated", value: "892", icon: MousePointer2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Trust Score", value: "98%", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-100" },
];

const pendingRequests = [
    { id: 1, businessName: "Luxe Fashion Hub", category: "Retail", status: "Pending" },
    { id: 2, businessName: "Gourmet Bites", category: "Restaurant", status: "Pending" },
    { id: 3, businessName: "FitLife Studio", category: "Fitness", status: "Pending" },
];

const myBanners = [
    {
        id: 1,
        title: "Summer Collection 2024",
        downloads: 45,
        clicks: 312,
        preview: "/api/placeholder/400/711",
        status: "Active"
    },
    {
        id: 2,
        title: "Weekend Flash Sale",
        downloads: 97,
        clicks: 580,
        preview: "/api/placeholder/400/711",
        status: "Active"
    },
];

export default function DashboardPage() {
    const [hasActivePromotion, setHasActivePromotion] = useState(true); // Toggle for demo

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Dashboard</h1>
                <p className="text-[#64748B]">Manage your promotions, banners, and collaborations from one place.</p>
            </div>

            {/* Promotion Status Card */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-[#0F172A]">Today's Promotion</h2>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {!hasActivePromotion ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-10 border border-slate-200 border-dashed flex flex-col items-center text-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Megaphone className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">You don’t have an active promotion today.</h3>
                        <p className="text-[#64748B] mb-8 max-w-sm">Promote other businesses to build your trust score and get your banner promoted by the community.</p>
                        <Link
                            href="/find-businesses"
                            className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Store className="w-5 h-5" />
                            <span>Find Businesses to Promote</span>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row"
                    >
                        <div className="w-full md:w-[280px] h-[360px] relative bg-slate-100 shrink-0">
                            <img
                                src="/api/placeholder/1080/1920"
                                alt="Promoting Banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div className="text-white">
                                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Promoting</p>
                                    <p className="text-lg font-bold">Luxe Fashion Hub</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Active Now</span>
                                    </div>
                                    <div className="text-[14px] font-medium text-slate-500">
                                        Started at 09:00 AM Today
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Summer Collection Launch</h3>
                                <p className="text-[#64748B] mb-8 leading-relaxed max-w-xl">
                                    You are currently promoting Luxe Fashion Hub's summer collection. Download their banner and post it on your WhatsApp/Instagram stories to earn points.
                                </p>

                                <div className="flex items-center gap-2 mb-8 text-[#2563EB] font-bold">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="text-lg">Promotion ends in <span className="text-[#2563EB]">18h 24m</span></div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10">
                                    <Download className="w-5 h-5" />
                                    <span>Download Banner</span>
                                </button>
                                <button className="px-6 py-3 bg-white border border-slate-200 text-[#0F172A] font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <UploadIcon className="w-5 h-5 text-slate-400" />
                                    <span>Upload Proof</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
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

                {/* Quick Actions & Recent Requests */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Recent Requests */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#0F172A]">Recent Promotion Requests</h3>
                            <Link href="/requests" className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Business Name</th>
                                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-[#0F172A]">{req.businessName}</td>
                                            <td className="px-6 py-4 text-slate-600 text-[14px]">{req.category}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors shadow-sm">
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* My Active Banners */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#0F172A]">My Active Banners</h3>
                            <Link href="/my-banners" className="text-xs font-bold text-[#2563EB] uppercase tracking-widest hover:underline">
                                Manage Banners
                            </Link>
                        </div>

                        {myBanners.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl border border-slate-200 border-dashed text-center flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                    <Megaphone className="w-6 h-6" />
                                </div>
                                <p className="text-slate-500">You have not uploaded any promotion banner yet.</p>
                                <button className="mt-4 text-[#2563EB] font-bold text-sm hover:underline flex items-center gap-1">
                                    <PlusCircle className="w-4 h-4" /> Upload First Banner
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {myBanners.map((banner) => (
                                    <div key={banner.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
                                        <div className="h-48 relative overflow-hidden bg-slate-100">
                                            <img
                                                src={banner.preview}
                                                alt={banner.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-white">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-[#0F172A] mb-4 truncate" title={banner.title}>{banner.title}</h4>
                                            <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100">
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Downloads</p>
                                                    <p className="text-lg font-bold text-[#0F172A]">{banner.downloads}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Clicks</p>
                                                    <p className="text-lg font-bold text-[#0F172A]">{banner.clicks}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <button className="flex-1 px-3 py-2 bg-slate-50 text-[#0F172A] text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                                                    Edit Banner
                                                </button>
                                                <button className="px-3 py-2 text-red-600 text-xs font-bold hover:bg-red-50 rounded-lg transition-colors">
                                                    Deactivate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Link
                                    href="/onboarding/banner"
                                    className="bg-[#F8FAFC] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-[#2563EB] hover:bg-white transition-all group min-h-[300px]"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 shadow-sm transition-transform">
                                        <PlusCircle className="w-6 h-6 text-[#2563EB]" />
                                    </div>
                                    <p className="font-bold text-[#0F172A]">Add New Banner</p>
                                    <p className="text-xs text-slate-500 mt-1">Upload another story promotion</p>
                                </Link>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Quick Actions Column */}
                <div className="space-y-8">

                    {/* Quick Actions */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-blue-500" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: "Find Businesses", icon: Store, href: "/find-businesses" },
                                { label: "Upload New Banner", icon: UploadIcon, href: "/onboarding/banner" },
                                { label: "Promotion Requests", icon: Megaphone, href: "/requests" },
                                { label: "View Analytics", icon: BarChart3, href: "/analytics" }
                            ].map((action, idx) => (
                                <Link
                                    key={idx}
                                    href={action.href}
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#2563EB] hover:bg-blue-50 group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <action.icon className="w-5 h-5 text-slate-600 group-hover:text-[#2563EB] transition-colors" />
                                        </div>
                                        <span className="font-semibold text-slate-700 group-hover:text-[#2563EB]">{action.label}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Invite Widget */}
                    <section className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Invite Businesses</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Invite other companies to the network and earn premium points & high trust scores.
                            </p>
                            <button className="w-full py-3 bg-white text-[#2563EB] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                                Copy Invite Link
                            </button>
                        </div>
                        {/* Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -left-4 -top-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl" />
                    </section>

                    {/* Tips / Help Card */}
                    <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-[#0F172A] font-bold mb-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm">Pro Tip</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed italic">
                            "Promotions with clear QR codes and high-quality vertical banners get 4x more clicks and downloads from other businesses."
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
