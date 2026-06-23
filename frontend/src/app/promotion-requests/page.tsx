"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Megaphone, CheckCircle2, XCircle, Clock, MapPin, Star,
    Download, Upload, ArrowUpRight, ArrowDownLeft, Timer,
    Check, X, Store, AlertCircle, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/protected-route";
import { toast } from "react-hot-toast";

import { 
    getIncomingRequests, getSentRequests, 
    acceptRequest, rejectRequest, cancelRequest 
} from "@/api/request.api";
import { getActivePromotions, getCompletedPromotions, uploadPromotionProof } from "@/api/promotions.api";
import { useNotificationSocket } from "@/context/notification-context";
import { RequestDrawer } from "@/components/RequestDrawer";

type Tab = "incoming" | "sent" | "active" | "completed";

export default function PromotionRequestsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("incoming");
    
    // Data States
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [sentRequests, setSentRequests] = useState<any[]>([]);
    const [activePromotions, setActivePromotions] = useState<any[]>([]);
    const [completedPromotions, setCompletedPromotions] = useState<any[]>([]);

    // Loading & Pagination States
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [skip, setSkip] = useState({ incoming: 0, sent: 0, active: 0, completed: 0 });
    const [hasMore, setHasMore] = useState({ incoming: true, sent: true, active: true, completed: true });

    // Modals & Drawer
    const [cancelModalId, setCancelModalId] = useState<string | null>(null);
    const [drawerReq, setDrawerReq] = useState<any | null>(null);

    const { socket } = useNotificationSocket();

    useEffect(() => {
        fetchTabData(activeTab, true);
    }, [activeTab]);

    // WebSocket Integration
    useEffect(() => {
        if (!socket) return;

        const handleSocketMessage = (notification: any) => {
            if (!notification || !notification.type || !notification.data) return;

            if (notification.type === 'request_received') {
                setIncomingRequests(prev => [notification.data, ...prev]);
                toast.success('New promotion request received!');
            }
            if (notification.type === 'request_approved') {
                setSentRequests(prev => prev.map(req => req.id === notification.data.id ? notification.data : req));
                if (notification.data.promotion) {
                    setActivePromotions(prev => [notification.data.promotion, ...prev]);
                }
                toast.success('Your promotion request was approved!');
            }
            if (notification.type === 'request_rejected') {
                setSentRequests(prev => prev.map(req => req.id === notification.data.id ? notification.data : req));
                toast.error('Your promotion request was rejected.');
            }
            if (notification.type === 'request_cancelled') {
                setIncomingRequests(prev => prev.map(req => req.id === notification.data.id ? notification.data : req));
            }
            if (notification.type === 'promotion_completed') {
                setActivePromotions(prev => prev.filter(promo => promo.id !== notification.data.id));
                setCompletedPromotions(prev => [notification.data, ...prev]);
                toast.success('Promotion successfully completed!');
            }
        };

        socket.on('new-notification', handleSocketMessage);
        return () => {
            socket.off('new-notification', handleSocketMessage);
        };
    }, [socket]);

    const fetchTabData = async (tab: Tab, reset = false) => {
        try {
            if (reset) setLoading(true);
            const currentSkip = reset ? 0 : skip[tab];
            const take = 20;

            let data: any[] = [];
            if (tab === "incoming") {
                data = await getIncomingRequests(currentSkip, take);
                setIncomingRequests(prev => reset ? data : [...prev, ...data]);
            } else if (tab === "sent") {
                data = await getSentRequests(currentSkip, take);
                setSentRequests(prev => reset ? data : [...prev, ...data]);
            } else if (tab === "active") {
                data = await getActivePromotions(currentSkip, take);
                setActivePromotions(prev => reset ? data : [...prev, ...data]);
            } else if (tab === "completed") {
                data = await getCompletedPromotions(currentSkip, take);
                setCompletedPromotions(prev => reset ? data : [...prev, ...data]);
            }

            setHasMore(prev => ({ ...prev, [tab]: data.length === take }));
            if (!reset) {
                setSkip(prev => ({ ...prev, [tab]: currentSkip + take }));
            } else {
                setSkip(prev => ({ ...prev, [tab]: take }));
            }
        } catch (error) {
            toast.error("Failed to load data.");
        } finally {
            if (reset) setLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        try {
            setActionLoading(id);
            const res = await acceptRequest(id);
            setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
            toast.success("Request approved! Promotion is now active.");
            fetchTabData('active', true);
            if (drawerReq?.id === id) setDrawerReq({ ...drawerReq, status: 'APPROVED' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to accept");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        try {
            setActionLoading(id);
            await rejectRequest(id);
            setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
            toast.success("Request rejected");
            if (drawerReq?.id === id) setDrawerReq({ ...drawerReq, status: 'REJECTED' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            setActionLoading(id);
            await cancelRequest(id);
            setSentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
            toast.success("Request cancelled");
            if (drawerReq?.id === id) setDrawerReq({ ...drawerReq, status: 'CANCELLED' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel");
        } finally {
            setActionLoading(null);
            setCancelModalId(null);
        }
    };

    const tabs = [
        { id: "incoming", label: "Incoming", icon: ArrowDownLeft },
        { id: "sent", label: "Sent", icon: ArrowUpRight },
        { id: "active", label: "Active", icon: Timer },
        { id: "completed", label: "Completed", icon: CheckCircle2 },
    ] as const;

    return (
        <ProtectedRoute>
            <div className="space-y-8 pb-12 max-w-[1200px] mx-auto px-4 sm:px-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2 mt-8">Promotion Requests</h1>
                    <p className="text-[#64748B] text-lg">Manage business collaborations and approve promotion partnerships.</p>
                </div>

                <div className="border-b border-slate-200 overflow-x-auto no-scrollbar">
                    <div className="flex gap-8 min-w-max">
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

                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {activeTab === "incoming" && (
                                <div className="space-y-6">
                                    {incomingRequests.length === 0 ? (
                                        <EmptyState title="No incoming requests" description="When other businesses want to collaborate, their requests will appear here." />
                                    ) : (
                                        incomingRequests.map((req) => (
                                            <RequestCard key={req.id} req={req} type="incoming" actionLoading={actionLoading} onAccept={handleAccept} onReject={handleReject} onClick={() => setDrawerReq(req)} />
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === "sent" && (
                                <div className="space-y-6">
                                    {sentRequests.length === 0 ? (
                                        <EmptyState title="No sent requests" description="Discover businesses and start collaborations to grow your reach." />
                                    ) : (
                                        sentRequests.map((req) => (
                                            <RequestCard key={req.id} req={req} type="sent" actionLoading={actionLoading} onCancel={() => setCancelModalId(req.id)} onClick={() => setDrawerReq(req)} />
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === "active" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activePromotions.length === 0 ? (
                                        <div className="col-span-full">
                                            <EmptyState title="No active promotions" description="Approved collaborations will appear here while they run." />
                                        </div>
                                    ) : (
                                        activePromotions.map((promo) => (
                                            <PromotionCard key={promo.id} promo={promo} />
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === "completed" && (
                                <div className="space-y-6">
                                    {completedPromotions.length === 0 ? (
                                        <EmptyState title="No completed promotions" description="Your past successful collaborations will be logged here." />
                                    ) : (
                                        completedPromotions.map((promo) => (
                                            <PromotionCard key={promo.id} promo={promo} isCompleted />
                                        ))
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    )}

                    {!loading && hasMore[activeTab] && (
                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={() => fetchTabData(activeTab)}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>

                {/* Cancel Confirmation Modal */}
                <AnimatePresence>
                    {cancelModalId && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <XCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-center text-[#0F172A] mb-2">Cancel Request?</h3>
                                <p className="text-center text-slate-500 mb-8">Are you sure you want to cancel this promotion request? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setCancelModalId(null)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Keep Request</button>
                                    <button onClick={() => handleCancel(cancelModalId)} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center">
                                        {actionLoading === cancelModalId ? <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"/> : "Cancel Request"}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <RequestDrawer 
                    isOpen={!!drawerReq} 
                    onClose={() => setDrawerReq(null)} 
                    req={drawerReq} 
                    type={activeTab === "sent" ? "sent" : "incoming"} 
                    onAccept={handleAccept} 
                    onReject={handleReject} 
                    onCancel={() => setCancelModalId(drawerReq?.id)} 
                />
            </div>
        </ProtectedRoute>
    );
}

function RequestCard({ req, type, onAccept, onReject, onCancel, actionLoading, onClick }: any) {
    const isPending = req.status === "PENDING";
    const partner = type === "incoming" ? req.senderBusiness : req.receiverBusiness;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center gap-6"
        >
            <div className="flex items-center gap-5 lg:w-[320px] shrink-0">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden shrink-0">
                    {partner?.logoUrl ? <Image src={partner.logoUrl} alt="Logo" fill className="object-cover" /> : <Store className="w-8 h-8 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <div>
                    <h3 className="font-bold text-[#0F172A] text-lg leading-tight mb-1">{partner?.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{partner?.category} • {partner?.city || partner?.location || "India"}</p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-700">{partner?.trustScore || 50} Trust Score</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 lg:flex-1">
                <div className="relative aspect-[9/16] w-14 h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {req.banner?.imageUrl && <Image src={req.banner.imageUrl} alt="Banner" fill className="object-cover" />}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                        <StatusBadge status={req.status} />
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Sent on {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:w-[260px] shrink-0 pt-4 lg:pt-0 border-t lg:border-none border-slate-100">
                {type === "incoming" && isPending && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); onAccept(req.id); }} disabled={!!actionLoading} className="flex-1 h-12 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center justify-center">
                            {actionLoading === req.id ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> : "Approve"}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onReject(req.id); }} disabled={!!actionLoading} className="px-5 h-12 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all">Reject</button>
                    </>
                )}
                {type === "sent" && isPending && (
                    <button onClick={(e) => { e.stopPropagation(); onCancel(); }} className="w-full h-12 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all uppercase text-sm tracking-wide">
                        Cancel Request
                    </button>
                )}
                {!isPending && (
                    <div className="w-full h-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 font-bold text-sm">
                        No actions available
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function PromotionCard({ promo, isCompleted }: { promo: any, isCompleted?: boolean }) {
    const partner = promo.request.senderBusiness; // For simplicity. If user is sender, it should be receiver. Let's just use sender info for now.
    
    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex h-full">
            <div className="w-[140px] relative bg-slate-100 shrink-0">
                {promo.request.banner?.imageUrl && <Image src={promo.request.banner.imageUrl} alt="Banner" fill className="object-cover" />}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h4 className="text-[#0F172A] font-bold text-xl mb-1">{partner?.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Promoting Partner</p>
                    {isCompleted ? (
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Completed On</span>
                                <span className="font-bold text-slate-700">{new Date(promo.endTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Duration</span>
                                <span className="font-bold text-emerald-600">24 Hours</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Performance</span>
                                <span className="font-bold text-blue-600">Simulated 142 Clicks</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time Remaining</p>
                                <CountdownTimer targetDate={promo.endTime} />
                            </div>
                        </div>
                    )}
                </div>
                {!isCompleted && (
                    <div className="flex gap-2">
                        <button className="flex-1 h-10 bg-[#0F172A] text-white text-xs font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                            <Download className="w-3 h-3" /> Banner
                        </button>
                        <button className="flex-1 h-10 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Upload className="w-3 h-3 text-slate-400" /> Proof
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-600 border-amber-200",
        APPROVED: "bg-green-50 text-green-600 border-green-200",
        REJECTED: "bg-red-50 text-red-600 border-red-200",
        CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
        EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
        <span className={cn("px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider", styles[status] || styles.PENDING)}>
            {status}
        </span>
    );
}

function EmptyState({ title, description }: { title: string, description: string }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 border-dashed py-16 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
            <p className="text-slate-500 text-sm max-w-[250px] mx-auto">{description}</p>
        </div>
    );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState("--h --m --s");

    useEffect(() => {
        const interval = setInterval(() => {
            const distance = new Date(targetDate).getTime() - Date.now();
            if (distance < 0) {
                setTimeLeft("Ended");
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

    return <p className="text-sm font-black text-[#2563EB]">{timeLeft}</p>;
}
