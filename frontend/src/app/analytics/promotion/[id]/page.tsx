"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    ArrowLeft, 
    BarChart3, 
    Loader2,
    Calendar,
    MousePointer2,
    ScanLine,
    Activity
} from "lucide-react";
import ProtectedRoute from "@/components/protected-route";

export default function PromotionAnalyticsPage() {
    const params = useParams();
    const id = params?.id as string;
    
    // In a full implementation, you would fetch details for this specific promotion
    // For MVP, this page is a placeholder
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        setTimeout(() => setIsLoading(false), 800);
    }, [id]);

    return (
        <ProtectedRoute>
            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/analytics" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-sm font-semibold text-[#1E73E8] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Promotion Details</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Promotion #{id?.substring(0, 8)}</h1>
                    <p className="text-[#64748B]">Detailed activity timeline and engagement metrics for this specific promotion.</p>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Detailed View Coming Soon</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            The granular timeline view for individual promotions is planned for the next feature release. 
                            For now, use the main Analytics page to export full performance data.
                        </p>
                        <Link 
                            href="/analytics"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Return to Analytics
                        </Link>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
