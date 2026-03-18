"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Download,
    MousePointer2,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Power,
    ChevronRight,
    BarChart3,
    Image as ImageIcon,
    AlertCircle,
    X,
    PlusCircle,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const initialBanners = [
    {
        id: 1,
        title: "Summer Collection 2024",
        status: "Active",
        downloads: 142,
        clicks: 892,
        preview: "/api/placeholder/1080/1920",
        uploadedDate: "Oct 12, 2023",
        category: "Fashion"
    },
    {
        id: 2,
        title: "Flash Sale - Weekend Only",
        status: "Active",
        downloads: 97,
        clicks: 580,
        preview: "/api/placeholder/1080/1920",
        uploadedDate: "Nov 05, 2023",
        category: "Retail"
    },
    {
        id: 3,
        title: "New Arrival - Tech Gear",
        status: "Inactive",
        downloads: 0,
        clicks: 0,
        preview: "/api/placeholder/1080/1920",
        uploadedDate: "Dec 20, 2023",
        category: "Digital"
    }
];

import ProtectedRoute from "@/components/protected-route";

export default function MyBannersPage() {
    const [banners, setBanners] = useState(initialBanners);
    const [showDeactivateModal, setShowDeactivateModal] = useState<number | null>(null);

    const toggleStatus = (id: number) => {
        setBanners(prev => prev.map(banner =>
            banner.id === id
                ? { ...banner, status: banner.status === "Active" ? "Inactive" : "Active" }
                : banner
        ));
    };

    const deleteBanner = (id: number) => {
        setBanners(prev => prev.filter(banner => banner.id !== id));
        setShowDeactivateModal(null);
    };

    return (
        <ProtectedRoute>
            <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">My Promotion Banners</h1>
                    <p className="text-[#64748B] text-lg">Manage your uploaded banners and track their performance across the network.</p>
                </div>
                <Link
                    href="/onboarding/banner"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Upload New Banner
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Active Banners", value: banners.filter(b => b.status === "Active").length, icon: ImageIcon, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Downloads", value: banners.reduce((acc, b) => acc + b.downloads, 0), icon: Download, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Total Clicks", value: banners.reduce((acc, b) => acc + b.clicks, 0), icon: MousePointer2, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                        </div>
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Banners Grid */}
            {banners.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">No banners uploaded yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Start your first cross-promotion by uploading a vertical story banner for your business.</p>
                    <Link
                        href="/onboarding/banner"
                        className="px-8 py-3 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Upload First Banner
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map((banner) => (
                        <motion.div
                            key={banner.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden group flex flex-col"
                        >
                            {/* Preview Area */}
                            <div className="relative aspect-[9/16] w-full bg-slate-100 overflow-hidden">
                                <Image
                                    src={banner.preview}
                                    alt={banner.title}
                                    fill
                                    className={cn(
                                        "object-cover transition-transform duration-700 group-hover:scale-105",
                                        banner.status === "Inactive" && "grayscale opacity-50"
                                    )}
                                />

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border backdrop-blur-md",
                                        banner.status === "Active"
                                            ? "bg-emerald-500/90 text-white border-emerald-400"
                                            : "bg-slate-500/90 text-white border-slate-400"
                                    )}>
                                        {banner.status}
                                    </div>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2563EB] shadow-xl hover:scale-110 transition-transform">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowDeactivateModal(banner.id)}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-110 transition-transform"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-1 truncate" title={banner.title}>{banner.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                        <span>{banner.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span>{banner.uploadedDate}</span>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mb-6">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                            <Download className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Downloads</span>
                                        </div>
                                        <p className="text-xl font-black text-[#0F172A]">{banner.downloads}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                            <MousePointer2 className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Clicks</span>
                                        </div>
                                        <p className="text-xl font-black text-[#0F172A]">{banner.clicks}</p>
                                    </div>
                                </div>

                                {/* Footer Toggle */}
                                <button
                                    onClick={() => toggleStatus(banner.id)}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border",
                                        banner.status === "Active"
                                            ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                                            : "bg-[#2563EB] text-white border-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    )}
                                >
                                    <Power className="w-4 h-4" />
                                    {banner.status === "Active" ? "Deactivate Banner" : "Activate Banner"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete/Deactivate Confirmation Modal */}
            <AnimatePresence>
                {showDeactivateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeactivateModal(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-[400px] p-8 relative shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Delete Banner?</h3>
                                <p className="text-slate-500 leading-relaxed mb-8 text-sm">
                                    Are you sure you want to delete this banner? This will remove all its performance data and ongoing promotions. This action cannot be undone.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => deleteBanner(showDeactivateModal)}
                                        className="w-full h-[54px] bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Yes, Delete Permanent
                                    </button>
                                    <button
                                        onClick={() => setShowDeactivateModal(null)}
                                        className="w-full h-[54px] text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
}
