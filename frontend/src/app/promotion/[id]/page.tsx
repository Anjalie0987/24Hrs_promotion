"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    Upload as UploadIcon,
    Clock,
    MapPin,
    Star,
    CheckCircle2,
    Info,
    ExternalLink,
    QrCode,
    FileText,
    ChevronLeft,
    ShieldCheck,
    AlertCircle,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for a single promotion
const promotionData = {
    id: "promo-123",
    business: {
        name: "Luxe Fashion Hub",
        logo: "/api/placeholder/80/80",
        category: "Fashion",
        location: "Mumbai, MH",
        trustScore: 4.8,
    },
    banner: "/api/placeholder/1080/1920",
    endTime: new Date(Date.now() + 18 * 3600 * 1000 + 42 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    trackingLink: "https://platform.com/r/abc123",
};

export default function ActivePromotionPage() {
    const params = useParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    // Countdown Logic
    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(promotionData.endTime).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft("Completed");
                clearInterval(timer);
                return;
            }

            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmitProof = () => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Back Link & Header */}
            <div className="space-y-4">
                <Link
                    href="/promotion-requests"
                    className="flex items-center gap-2 text-slate-500 hover:text-[#2563EB] font-bold text-sm transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Requests
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2 text-balance">Active Promotion</h1>
                    <p className="text-[#64748B] text-lg">Promote this banner on your WhatsApp, Instagram, or Facebook story for 24 hours.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Promotion Info & Assets */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Status Card */}
                    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                    <Image
                                        src={promotionData.business.logo}
                                        alt={promotionData.business.name}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Promoting Business</p>
                                    <h2 className="text-2xl font-bold text-[#0F172A] mb-1">{promotionData.business.name}</h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500">{promotionData.business.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                            {promotionData.business.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold text-amber-700">{promotionData.business.trustScore} Trust Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Timer Row */}
                        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Promotion ends in</p>
                            <div className="text-4xl md:text-5xl font-black text-[#2563EB] tracking-tight tabular-nums">
                                {timeLeft}
                            </div>
                        </div>
                    </section>

                    {/* Banner Preview */}
                    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                Promotion Banner
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Story Format Preview</span>
                        </div>

                        <div className="relative aspect-[9/16] w-full max-w-[400px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 ring-1 ring-slate-200">
                            <Image
                                src={promotionData.banner}
                                alt="Banner Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <div className="text-white text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Automated Watermark Included</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tracking Section */}
                    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-6">Promotion Tracking</h3>
                        <div className="space-y-4">
                            <p className="text-[13px] text-slate-500 leading-relaxed">
                                Use this link if someone asks for more information about the promotion. All clicks are automatically tracked.
                            </p>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Promotion Link</label>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="text-sm font-semibold truncate text-blue-600">{promotionData.trackingLink}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Actions & Progress */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Download Card */}
                    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-4">Download Banner</h3>
                        <p className="text-[#64748B] text-[14px] leading-relaxed mb-8">
                            Download this banner and post it on your story. The platform has automatically added your unique tracking link and watermark.
                        </p>
                        <button className="w-full py-4 bg-gradient-to-r from-[#38BDF8] to-[#1D4ED8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                            <Download className="w-6 h-6" />
                            <span className="text-lg">Download Banner</span>
                        </button>
                        <div className="mt-6 space-y-3">
                            {[
                                "Platform watermark included",
                                "Optimized for Story format"
                            ].map((item, id) => (
                                <div key={id} className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Upload Proof */}
                    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Upload Promotion Proof</h3>
                        <p className="text-[#64748B] text-[13px] mb-6">Upload a screenshot of your story after posting the banner.</p>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            className={cn(
                                "w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer",
                                isDragging ? "bg-blue-50 border-[#2563EB]" : "bg-slate-50 border-slate-200 hover:border-[#2563EB] hover:bg-white"
                            )}
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <UploadIcon className="w-8 h-8 text-slate-300 group-hover:text-[#2563EB]" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-[#0F172A]">Click or drag screenshot</p>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitProof}
                            className="w-full mt-6 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-black transition-all"
                        >
                            Submit Proof
                        </button>
                    </section>

                    {/* Guidelines */}
                    <section className="bg-[#F1F5F9] rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-[#0F172A]">
                            <AlertCircle className="w-5 h-5 text-[#2563EB]" />
                            <h3 className="font-bold">Promotion Guidelines</h3>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "Post the banner on your social stories",
                                "Keep the story live for full 24 hours",
                                "Do not crop or modify the banner image"
                            ].map((guide, idx) => (
                                <li key={idx} className="flex gap-2 text-[13px] text-slate-600 leading-tight">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                                    {guide}
                                </li>
                            ))}
                        </ul>
                    </section>

                </div>
            </div>

            {/* Success Notification */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
                    >
                        <div className="bg-[#0F172A] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-[16px]">Proof submitted successfully!</p>
                                <p className="text-slate-400 text-xs">Your promotion is being verified by the platform.</p>
                            </div>
                            <button onClick={() => setIsSuccess(false)} className="ml-4 text-slate-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
