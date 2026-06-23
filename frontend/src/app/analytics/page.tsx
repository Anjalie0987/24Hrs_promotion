"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { 
    Download, 
    ArrowLeft, 
    BarChart3, 
    Search,
    Filter,
    Loader2,
    Store,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { getAnalyticsPromotions, getAnalyticsChart, exportAnalyticsCsv } from "@/api/analytics.api";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import ProtectedRoute from "@/components/protected-route";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const limit = 10;
    const [isExporting, setIsExporting] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['analytics', page],
        queryFn: async () => {
            const skip = (page - 1) * limit;
            const [promoData, chart] = await Promise.all([
                getAnalyticsPromotions(skip, limit),
                getAnalyticsChart(30)
            ]);
            return { promoData, chart };
        }
    });

    const promotions = data?.promoData?.items || [];
    const totalItems = data?.promoData?.total || 0;
    const chartData = data?.chart || [];

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const csvBlob = await exportAnalyticsCsv();
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([csvBlob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export analytics report.");
        } finally {
            setIsExporting(false);
        }
    };

    const totalPages = Math.ceil(totalItems / limit);

    const filteredPromotions = promotions.filter((p: any) => 
        p.partnerName.toLowerCase().includes(search.toLowerCase()) ||
        p.bannerTitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <span className="text-sm font-semibold text-[#1E73E8] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Deep Analytics</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Promotion Performance</h1>
                        <p className="text-[#64748B]">Analyze your cross-promotion engagement in detail.</p>
                    </div>
                    
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-fit disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export CSV
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error instanceof Error ? error.message : "Failed to load analytics data."}
                    </div>
                )}

                {/* Detailed Chart */}
                <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-[#0F172A]">Engagement Trends</h2>
                            <p className="text-sm text-[#64748B]">Last 30 Days of Clicks and QR Scans</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            30 Days
                        </div>
                    </div>
                    
                    {isLoading && chartData.length === 0 ? (
                        <div className="h-[350px] w-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <AnalyticsChart data={chartData} />
                    )}
                </section>

                {/* Performance Table */}
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-[#0F172A]">All Promotions</h2>
                        
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search by partner or banner..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Partner</th>
                                    <th className="p-4">Banner</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Clicks</th>
                                    <th className="p-4 text-right">QR Scans</th>
                                    <th className="p-4">Start Date</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && promotions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center">
                                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                                            <p className="text-sm text-slate-400">Loading data...</p>
                                        </td>
                                    </tr>
                                ) : filteredPromotions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            No promotions match your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPromotions.map((promo: any) => (
                                        <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {promo.partnerLogo ? (
                                                        <Image src={promo.partnerLogo} alt={promo.partnerName} width={36} height={36} className="rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                                                            <Store className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-[#0F172A]">{promo.partnerName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Image src={promo.bannerUrl} alt="banner" width={24} height={42} className="rounded object-cover border border-slate-200" />
                                                    <span className="text-sm font-medium text-slate-700">{promo.bannerTitle}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full",
                                                    promo.status === 'ACTIVE' ? "bg-blue-50 text-blue-600" :
                                                    promo.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                                    "bg-slate-100 text-slate-600"
                                                )}>
                                                    {promo.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-blue-600">{promo.clicks}</td>
                                            <td className="p-4 text-right font-bold text-emerald-600">{promo.scans}</td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(promo.startDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link 
                                                    href={`/analytics/promotion/${promo.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                                                >
                                                    View Details
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> to <span className="font-bold text-slate-700">{Math.min(page * limit, totalItems)}</span> of <span className="font-bold text-slate-700">{totalItems}</span> entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold text-slate-700 px-2">{page} / {totalPages || 1}</span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}
