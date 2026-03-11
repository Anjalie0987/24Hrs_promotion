"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Megaphone,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    Star,
    Download,
    Upload,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    Timer,
    Check,
    X,
    Store,
    ExternalLink,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
type RequestStatus = "Pending" | "Accepted" | "Rejected";

interface BusinessRequest {
    id: number;
    businessName: string;
    category: string;
    location: string;
    trustScore: number;
    logo: string;
    banner: string;
    message: string;
    dateSent: string;
    status: RequestStatus;
}

interface ActivePromotion {
    id: number;
    businessName: string;
    banner: string;
    startTime: string;
    endTime: string; // ISO string for countdown
}

const incomingRequestsMock: BusinessRequest[] = [
    {
        id: 1,
        businessName: "Luxe Fashion Hub",
        category: "Fashion",
        location: "Mumbai, MH",
        trustScore: 4.8,
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
        message: "Luxe Fashion Hub wants to promote your banner for 24 hours.",
        dateSent: "2024-03-10",
        status: "Pending"
    },
    {
        id: 2,
        businessName: "Gourmet Bites",
        category: "Restaurant",
        location: "Pune, MH",
        trustScore: 4.5,
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
        message: "Gourmet Bites wants to promote your banner for 24 hours.",
        dateSent: "2024-03-11",
        status: "Pending"
    }
];

const sentRequestsMock: BusinessRequest[] = [
    {
        id: 101,
        businessName: "FitLife Studio",
        category: "Fitness",
        location: "Bangalore, KA",
        trustScore: 4.9,
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
        message: "You requested to promote FitLife Studio's banner.",
        dateSent: "2024-03-09",
        status: "Pending"
    },
    {
        id: 102,
        businessName: "TechWave Solutions",
        category: "Digital",
        location: "Hyderabad, TS",
        trustScore: 4.2,
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
        message: "You requested to promote TechWave Solutions' banner.",
        dateSent: "2024-03-08",
        status: "Accepted"
    }
];

const activePromotionsMock: ActivePromotion[] = [
    {
        id: 1,
        businessName: "TechWave Solutions",
        banner: "/api/placeholder/1080/1920",
        startTime: "2024-03-11T09:00:00Z",
        endTime: new Date(Date.now() + 16 * 3600 * 1000 + 32 * 60 * 1000).toISOString(),
    }
];

const tabs = [
    { id: "incoming", label: "Incoming Requests", icon: ArrowDownLeft },
    { id: "sent", label: "Sent Requests", icon: ArrowUpRight },
    { id: "active", label: "Active Promotions", icon: Timer },
];

export default function PromotionRequestsPage() {
    const [activeTab, setActiveTab] = useState("incoming");
    const [incomingRequests, setIncomingRequests] = useState(incomingRequestsMock);
    const [activePromotions, setActivePromotions] = useState(activePromotionsMock);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAccept = (req: BusinessRequest) => {
        // Mock acceptance logic
        setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
        const newPromotion: ActivePromotion = {
            id: Date.now(),
            businessName: req.businessName,
            banner: req.banner,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        };
        setActivePromotions(prev => [newPromotion, ...prev]);
        setSuccessMessage("Promotion started successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleReject = (id: number) => {
        setIncomingRequests(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Promotion Requests</h1>
                <p className="text-[#64748B] text-lg">Manage business collaborations and approve promotion partnerships.</p>
            </div>

            {/* Modern Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-8">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 py-4 text-[15px] font-bold transition-all relative",
                                    isActive ? "text-[#2563EB]" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", isActive ? "text-[#2563EB]" : "text-slate-400")} />
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "incoming" && (
                    <div className="space-y-6">
                        {incomingRequests.length === 0 ? (
                            <EmptyState
                                title="No promotion requests yet."
                                description="When other businesses want to promote with you, their requests will appear here."
                            />
                        ) : (
                            incomingRequests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center gap-8"
                                >
                                    {/* Left: Info */}
                                    <div className="flex items-center gap-5 lg:w-[320px] shrink-0">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                            <Image src={req.logo} alt={req.businessName} width={64} height={64} className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#0F172A] text-lg leading-tight mb-1">{req.businessName}</h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{req.category}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-slate-300" />
                                                    <span className="text-xs text-slate-500">{req.location}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-bold text-amber-700">{req.trustScore} Trust Score</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center: Banner Preview */}
                                    <div className="flex items-center gap-4 lg:flex-1">
                                        <div className="relative aspect-[9/16] w-16 h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                            <Image src={req.banner} alt="Banner" fill className="object-cover opacity-80" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                <span className="text-[8px] font-black text-white uppercase tracking-tighter opacity-70">Banner</span>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex-1">
                                            <p className="text-[14px] text-slate-700 font-medium italic">
                                                "{req.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-3 lg:w-[280px] shrink-0">
                                        <button
                                            onClick={() => handleAccept(req)}
                                            className="flex-1 h-12 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Accept Request
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="px-4 h-12 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "sent" && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {sentRequestsMock.length === 0 ? (
                            <div className="p-12">
                                <EmptyState
                                    title="You haven't sent any promotion requests."
                                    description="Discover businesses and start collaborations to grow your reach."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Business</th>
                                            <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Date Sent</th>
                                            <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {sentRequestsMock.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative">
                                                            <Image src={req.logo} alt={req.businessName} fill className="object-cover" />
                                                        </div>
                                                        <span className="font-bold text-[#0F172A]">{req.businessName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">{req.category}</td>
                                                <td className="px-6 py-4">
                                                    {req.status === "Pending" && (
                                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {req.status === "Accepted" && (
                                                        <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                            Accepted
                                                        </span>
                                                    )}
                                                    {req.status === "Rejected" && (
                                                        <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                            Rejected
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">{req.dateSent}</td>
                                                <td className="px-6 py-4 text-right">
                                                    {req.status === "Pending" && (
                                                        <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest">
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "active" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {activePromotions.length === 0 ? (
                            <div className="md:col-span-2">
                                <EmptyState
                                    title="No active promotions currently."
                                    description="When collaborations are approved, they will appear here as active 24h promotions."
                                />
                            </div>
                        ) : (
                            activePromotions.map((promo) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-full group"
                                >
                                    {/* Left: Banner */}
                                    <div className="w-full md:w-[200px] aspect-[9/16] relative bg-slate-100 shrink-0">
                                        <Image src={promo.banner} alt="Banner" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:hidden">
                                            <div>
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Promoting</p>
                                                <h4 className="text-white font-bold text-xl">{promo.businessName}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Promotion Info */}
                                    <div className="flex-1 p-8 flex flex-col">
                                        <div className="mb-auto">
                                            <div className="hidden md:block mb-6">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Promoting</p>
                                                <h4 className="text-[#0F172A] font-bold text-2xl">{promo.businessName}</h4>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                                        <Clock className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time Remaining</p>
                                                        <CountdownTimer targetDate={promo.endTime} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status</p>
                                                        <p className="text-[14px] font-bold text-emerald-600">Verification Pending</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                                            <button className="w-full h-12 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Download Banner
                                            </button>
                                            <button className="w-full h-12 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm">
                                                <Upload className="w-4 h-4 text-slate-400" />
                                                Upload Proof
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Success Success Notification */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
                    >
                        <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
                            <CheckCircle2 className="w-6 h-6" />
                            <p className="font-bold">{successMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EmptyState({ title, description }: { title: string, description: string }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <Megaphone className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8">{description}</p>
            <Link
                href="/businesses"
                className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all inline-flex items-center gap-2"
            >
                <Store className="w-5 h-5" />
                Find Businesses
            </Link>
        </div>
    );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
    // Basic countdown logic
    const [timeLeft, setTimeLeft] = useState("16h 32m 45s");

    useEffect(() => {
        const interval = setInterval(() => {
            const end = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft("Promotion Ended");
                clearInterval(interval);
                return;
            }

            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return <p className="text-lg font-black text-[#2563EB] leading-tight">{timeLeft}</p>;
}
