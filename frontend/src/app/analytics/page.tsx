"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    MousePointer2,
    QrCode,
    Download,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    LayoutGrid,
    History,
    Lightbulb,
    Store,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { cn } from "@/lib/utils";

// Mock Data for Charts
const chartData = {
    "7d": [
        { name: 'Mon', clicks: 45, scans: 32 },
        { name: 'Tue', clicks: 52, scans: 38 },
        { name: 'Wed', clicks: 48, scans: 35 },
        { name: 'Thu', clicks: 61, scans: 42 },
        { name: 'Fri', clicks: 55, scans: 40 },
        { name: 'Sat', clicks: 70, scans: 55 },
        { name: 'Sun', clicks: 65, scans: 50 },
    ],
    "30d": Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        clicks: Math.floor(Math.random() * 50) + 30,
        scans: Math.floor(Math.random() * 30) + 20,
    })),
    "90d": Array.from({ length: 90 }, (_, i) => ({
        name: `Week ${Math.floor(i / 7) + 1}`,
        clicks: Math.floor(Math.random() * 100) + 150,
        scans: Math.floor(Math.random() * 80) + 100,
    })),
};

const topBannersMock = [
    {
        id: 1,
        title: "Summer Collection 2024",
        preview: "/api/placeholder/1080/1920",
        clicks: 892,
        scans: 412,
        downloads: 142,
    },
    {
        id: 2,
        title: "Flash Sale - Weekend Only",
        preview: "/api/placeholder/1080/1920",
        clicks: 580,
        scans: 295,
        downloads: 97,
    },
    {
        id: 3,
        title: "New Arrival - Tech Gear",
        preview: "/api/placeholder/1080/1920",
        clicks: 420,
        scans: 180,
        downloads: 65,
    }
];

const historyMock = [
    { id: 1, date: "2024-03-11", business: "Luxe Fashion Hub", banner: "Summer Collection", clicks: 45, scans: 32, status: "Active" },
    { id: 2, date: "2024-03-10", business: "Gourmet Bites", banner: "New Menu Launch", clicks: 12, scans: 8, status: "Active" },
    { id: 3, date: "2024-03-08", business: "FitLife Studio", banner: "Membership Offer", clicks: 68, scans: 45, status: "Completed" },
    { id: 4, date: "2024-03-05", business: "TechWave Solutions", banner: "Software Promo", clicks: 24, scans: 15, status: "Expired" },
    { id: 5, date: "2024-03-01", business: "Style & Co", banner: "Winter Clearance", clicks: 95, scans: 70, status: "Completed" },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
    const [activeBanners, setActiveBanners] = useState(topBannersMock);

    const statsCards = [
        { label: "Total Clicks Generated", value: "1,492", icon: MousePointer2, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total QR Scans", value: "856", icon: QrCode, trend: "+8%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Banner Downloads", value: "324", icon: Download, trend: "+15%", color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Total Promotions Completed", value: "48", icon: CheckCircle2, trend: "+5%", color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Promotion Analytics</h1>
                <p className="text-[#64748B] text-lg">Track engagement generated from your banner promotions.</p>
            </div>

            {/* Section 1: Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-[#0F172A]">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Section 2: Engagement Graph */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-blue-500" />
                            Engagement Over Time
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Comparison of clicks and QR scans across all banners.</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                        {(["7d", "30d", "90d"] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    timeRange === range
                                        ? "bg-white text-[#2563EB] shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData[timeRange]}>
                            <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="clicks"
                                stroke="#2563EB"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorClicks)"
                                name="Clicks"
                            />
                            <Area
                                type="monotone"
                                dataKey="scans"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorScans)"
                                name="QR Scans"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Section 3: Top Performing Banners */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-purple-500" />
                            Top Performing Banners
                        </h3>
                        <Link href="/my-banners" className="text-sm font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topBannersMock.slice(0, 2).map((banner) => (
                            <div key={banner.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row group">
                                <div className="w-full sm:w-[120px] aspect-[9/16] relative bg-slate-100 shrink-0">
                                    <Image src={banner.preview} alt={banner.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="font-bold text-[#0F172A] mb-4 truncate text-lg" title={banner.title}>{banner.title}</h4>
                                    <div className="space-y-4 mb-auto">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Clicks</p>
                                                <p className="text-xl font-black text-[#0F172A]">{banner.clicks}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Downloads</p>
                                                <p className="text-lg font-bold text-slate-700">{banner.downloads}</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                            <span>QR Scans: {banner.scans}</span>
                                            <span className="text-emerald-500">+12% vs last week</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Performance Insights */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                        Performance Insights
                    </h3>
                    <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="relative z-10 space-y-6">
                            {[
                                { text: "Your banners received 124 clicks this week.", highlight: "high" },
                                { text: "Your most successful banner generated 45 clicks.", highlight: "normal" },
                                { text: "Engagement increased 32% compared to last week.", highlight: "success" }
                            ].map((insight, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg",
                                        idx === 0 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                                            idx === 2 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                                "bg-white/10 text-white/60 border border-white/5"
                                    )}>
                                        {idx === 2 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed opacity-90">{insight.text}</p>
                                </div>
                            ))}

                            <Link
                                href="/onboarding/banner"
                                className="mt-4 block w-full py-4 bg-white text-slate-900 text-center font-black rounded-xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest shadow-lg"
                            >
                                Boost Performance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Promotion History */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                        <History className="w-6 h-6 text-slate-400" />
                        Promotion History
                    </h3>
                    <button className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
                        Download CSV <Download className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Business Promoted</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Banner Title</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Clicks</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">QR Scans</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historyMock.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-8 py-5 font-bold text-slate-500 tabular-nums">{row.date}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded bg-slate-100 overflow-hidden relative">
                                                <Image src="/api/placeholder/40/40" alt="" fill className="object-cover" />
                                            </div>
                                            <span className="font-bold text-[#0F172A]">{row.business}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-600 font-medium">{row.banner}</td>
                                    <td className="px-8 py-5 font-black text-[#0F172A] tabular-nums">{row.clicks}</td>
                                    <td className="px-8 py-5 font-bold text-slate-400 tabular-nums">{row.scans}</td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            row.status === "Active" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                row.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                    "bg-slate-50 text-slate-400 border border-slate-200"
                                        )}>
                                            {row.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Empty State Suggestion (Optional check) */}
            {topBannersMock.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <BarChart3 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">You have no promotion data yet.</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-8">Start your first cross-promotion to see engagement and reach metrics.</p>
                    <Link
                        href="/businesses"
                        className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all inline-flex items-center gap-2"
                    >
                        <Store className="w-5 h-5" />
                        Find Businesses to Promote
                    </Link>
                </div>
            )}
        </div>
    );
}
