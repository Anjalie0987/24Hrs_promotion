"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    CheckCircle2,
    X,
    Plus,
    Info,
    ArrowRight,
    ExternalLink,
    Type,
    Link as LinkIcon,
    AlignLeft
} from "lucide-react";
import Link from "next/link";

export default function OnboardingBanner() {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const [banner, setBanner] = useState<string | null>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        link: "",
        description: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBanner(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    };

    const inputClasses = "w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[#1E293B] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all bg-white placeholder-[#94A3B8]";
    const labelClasses = "block text-[14px] font-semibold text-[#1E293B] mb-2";

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8">
            <div className="max-w-[720px] mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[28px] md:text-[32px] font-bold text-[#0F172A] mb-2"
                    >
                        Upload Your First Promotion Banner
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[#64748B] text-[16px] max-w-[600px] mx-auto leading-relaxed"
                    >
                        This banner will be promoted by other businesses through their social media stories for 24-hour cross promotion.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#1D4ED8] text-[13px] font-medium rounded-full border border-blue-100"
                    >
                        <Info className="w-4 h-4" />
                        <span>Platform automatically adds a watermark and tracking QR code.</span>
                    </motion.div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-12 gap-3 md:gap-6">
                    {[
                        { id: 1, label: "Business Profile", status: "completed" },
                        { id: 2, label: "Upload Banner", status: "active" },
                        { id: 3, label: "Dashboard", status: "pending" }
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-[13px] md:text-[14px] border-2 transition-all ${s.status === "active"
                                        ? "bg-[#1D4ED8] border-[#1D4ED8] text-white shadow-lg shadow-blue-500/20"
                                        : s.status === "completed"
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "bg-white border-[#E2E8F0] text-[#94A3B8]"
                                    }`}>
                                    {s.status === "completed" ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : s.id}
                                </div>
                                <span className={`text-[12px] md:text-[13px] font-medium hidden sm:block ${s.status === "active" ? "text-[#1D4ED8]" : s.status === "completed" ? "text-green-600" : "text-[#94A3B8]"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div className={`w-8 md:w-16 h-[2px] mx-1 md:mx-2 transition-all ${s.status === "completed" ? "bg-green-500" : "bg-[#E2E8F0]"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-[#F1F5F9] relative overflow-hidden"
                >
                    {/* Success Overlay */}
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-50 bg-white/95 flex items-center justify-center p-8 text-center"
                            >
                                <div className="max-w-[400px]">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Banner successfully published!</h3>
                                    <p className="text-[#64748B] mb-6">Welcome to 24HR Status Promotion. Opening your dashboard...</p>
                                    <div className="w-full h-1.5 bg-green-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: 0 }}
                                            transition={{ duration: 2, ease: "linear" }}
                                            className="w-full h-full bg-green-500"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Banner Upload */}
                        <section>
                            <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Upload Promotion Banner</h2>

                            <div
                                onClick={() => bannerInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#38BDF8]', 'bg-blue-50/50'); }}
                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#38BDF8]', 'bg-blue-50/50'); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-[#38BDF8]', 'bg-blue-50/50');
                                    const file = e.dataTransfer.files?.[0];
                                    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setBanner(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center min-h-[360px] ${banner ? "border-[#38BDF8] bg-blue-50/20" : "border-[#CBD5E1] hover:border-[#38BDF8] hover:bg-slate-50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    className="hidden"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileUpload}
                                />

                                {banner ? (
                                    <div className="relative w-full max-w-[220px] aspect-[9/16]">
                                        <Image src={banner} alt="Banner Preview" fill className="rounded-lg shadow-xl object-cover border-2 border-white ring-8 ring-blue-500/5" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setBanner(null); }}
                                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-lg hover:bg-black transition-colors z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0F172A]/80 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                                            Story Format Preview
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-[#38BDF8]" />
                                        </div>
                                        <p className="text-[#0F172A] font-bold">Drag & drop your banner here</p>
                                        <p className="text-[#64748B] text-[14px] mt-1">or <span className="text-[#38BDF8] font-semibold underline underline-offset-4">click to upload</span></p>
                                        <div className="flex gap-4 mt-6">
                                            <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                <span>JPG, PNG only</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                <span>Max 5 MB</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Banner Size Guide */}
                            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#38BDF8]/10 flex items-center justify-center rounded-lg text-[#38BDF8]">
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[#0F172A]">Recommended format</p>
                                        <p className="text-[12px] text-[#64748B]">1080 × 1920 (Vertical Story Format)</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#94A3B8] italic">"Most promotions are viewed on mobile story formats."</p>
                            </div>
                        </section>

                        {/* Banner Details Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section 2: Banner Title */}
                            <div>
                                <label className={labelClasses}>
                                    <div className="flex items-center gap-2 uppercase tracking-wider text-[11px] text-[#64748B] mb-1">
                                        <Type className="w-3.5 h-3.5" />
                                        <span>Banner Title</span>
                                    </div>
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Summer Sale – 30% Off"
                                    className={inputClasses}
                                    required
                                />
                                <p className="text-[11px] text-[#94A3B8] mt-1.5 ml-1">A short title helps businesses understand your promotion.</p>
                            </div>

                            {/* Section 3: Promotion Link */}
                            <div>
                                <label className={labelClasses}>
                                    <div className="flex items-center gap-2 uppercase tracking-wider text-[11px] text-[#64748B] mb-1">
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        <span>Promotion Link</span>
                                    </div>
                                </label>
                                <input
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="https://yourwebsite.com"
                                    className={inputClasses}
                                    required
                                />
                                <p className="text-[11px] text-[#94A3B8] mt-1.5 ml-1">This link will be used for click tracking and QR scans.</p>
                            </div>

                            {/* Section 4: Promotion Description */}
                            <div className="md:col-span-2">
                                <label className={labelClasses}>
                                    <div className="flex items-center gap-2 uppercase tracking-wider text-[11px] text-[#64748B] mb-1">
                                        <AlignLeft className="w-3.5 h-3.5" />
                                        <span>Promotion Description</span>
                                    </div>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell businesses what your promotion is about. Example: Get 30% off on all products this weekend."
                                    className={`${inputClasses} h-28 py-3 resize-none`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 5: Important Notice Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-[#1D4ED8] mb-3">
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[14px] font-bold">How Your Banner Will Be Used</h3>
                            </div>
                            <ul className="space-y-2.5">
                                {[
                                    "Other businesses can request to promote your banner",
                                    "After mutual approval they can download it with unique tracking",
                                    "The system automatically adds platform watermark and QR tracking",
                                    "Promotions run for 24 hours on social stories"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-2 text-[13px] text-[#475569] leading-tight">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <motion.button
                                whileHover={{ scale: 1.01, boxShadow: "0 15px 30px -10px rgba(29,78,216,0.25)" }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full h-[54px] bg-gradient-to-r from-[#38BDF8] to-[#1D4ED8] text-white font-bold text-[17px] rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Publish Banner & Enter Dashboard</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            <div className="mt-4 text-center">
                                <Link
                                    href="/dashboard"
                                    className="text-[14px] font-medium text-[#64748B] hover:text-[#1D4ED8] transition-colors"
                                >
                                    Skip for now (upload later)
                                </Link>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
