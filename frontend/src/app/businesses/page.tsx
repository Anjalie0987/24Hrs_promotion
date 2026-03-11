"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    Star,
    Filter,
    ChevronDown,
    MoreVertical,
    CheckCircle2,
    X,
    MessageSquare,
    ArrowRight,
    Info,
    Store,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const categories = ["All Categories", "Retail", "Restaurant", "Education", "Real Estate", "Fashion", "Fitness", "Digital Services", "Coaching", "Startup"];
const locations = ["All Locations", "Mumbai, MH", "Delhi, DL", "Bangalore, KA", "Pune, MH", "Hyderabad, TS"];

const businesses = [
    {
        id: 1,
        name: "Luxe Fashion Hub",
        category: "Fashion",
        location: "Mumbai, MH",
        trustScore: 4.8,
        description: "Premium ethnic wear and modern fashion for all occasions. Quality and style guaranteed.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    },
    {
        id: 2,
        name: "Gourmet Bites",
        category: "Restaurant",
        location: "Pune, MH",
        trustScore: 4.5,
        description: "Authentic continental cuisine with a modern twist. Experience the best flavors in town.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    },
    {
        id: 3,
        name: "FitLife Studio",
        category: "Fitness",
        location: "Bangalore, KA",
        trustScore: 4.9,
        description: "Holistic fitness and wellness sanctuary. Join our community for a healthier lifestyle.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    },
    {
        id: 4,
        name: "TechWave Solutions",
        category: "Digital Services",
        location: "Hyderabad, TS",
        trustScore: 4.2,
        description: "Innovative software solutions and digital marketing strategies to grow your business online.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    },
    {
        id: 5,
        name: "Green Earth Nurseries",
        category: "Retail",
        location: "Pune, MH",
        trustScore: 4.7,
        description: "Wide variety of indoor and outdoor plants. Let's make the world greener together.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    },
    {
        id: 6,
        name: "SkillUp Academy",
        category: "Education",
        location: "Delhi, DL",
        trustScore: 4.6,
        description: "Empowering individuals with high-demand professional skills. Learn from the industry experts.",
        logo: "/api/placeholder/80/80",
        banner: "/api/placeholder/1080/1920",
    }
];

export default function FindBusinesses() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRequest = (business: typeof businesses[0]) => {
        setSelectedBusiness(business);
        setIsModalOpen(true);
    };

    const confirmRequest = () => {
        setIsModalOpen(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 4000);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Find Businesses to Promote</h1>
                <p className="text-[#64748B] text-lg">Discover businesses that are ready for cross promotion and grow together.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search business name..."
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-[15px] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        className="h-12 px-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-[14px] font-medium text-slate-700 min-w-[160px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select className="h-12 px-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-[14px] font-medium text-slate-700 min-w-[160px]">
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>

                    <button className="h-12 px-6 bg-[#0F172A] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-black transition-all">
                        <Filter className="w-4 h-4" />
                        <span>Apply Filters</span>
                    </button>
                </div>
            </div>

            {/* Business Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businesses.map((biz) => (
                    <motion.div
                        key={biz.id}
                        whileHover={{ y: -6 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
                    >
                        {/* Card Header */}
                        <div className="p-6 pb-4 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                    <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">{biz.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{biz.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-[11px] font-bold text-amber-700">{biz.trustScore}</span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="px-6 space-y-3">
                            <div className="flex items-center gap-2 text-[13px] text-slate-500">
                                <MapPin className="w-4 h-4 text-slate-300" />
                                <span>{biz.location}</span>
                            </div>
                            <p className="text-[14px] text-slate-600 line-clamp-2 leading-relaxed">
                                {biz.description}
                            </p>
                        </div>

                        {/* Banner Preview */}
                        <div className="mt-6 px-6 relative">
                            <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 ring-4 ring-slate-50">
                                <img src={biz.banner} alt="Banner Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        Promotion Banner
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-6 pt-6 flex flex-col gap-3">
                            <button
                                onClick={() => handleRequest(biz)}
                                className="w-full h-[50px] bg-gradient-to-r from-[#38BDF8] to-[#1D4ED8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span>Send Promotion Request</span>
                            </button>
                            <button className="w-full text-slate-500 text-sm font-semibold hover:text-[#0F172A] transition-colors">
                                View Business Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Promotion Request Modal */}
            <AnimatePresence>
                {isModalOpen && selectedBusiness && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-[480px] p-8 relative shadow-2xl overflow-hidden"
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Store className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Send Promotion Request</h3>
                                <p className="text-slate-600 leading-relaxed mb-8">
                                    You are requesting to promote <span className="font-bold text-[#0F172A]">{selectedBusiness.name}'s</span> banner for 24 hours. After approval, both businesses will promote each other's banners.
                                </p>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 flex items-start gap-3 text-left">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-200 mt-1">
                                        <Info className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <p className="text-[13px] text-slate-500">
                                        A high Trust Score increases your chances of request approval. Ensure your banner is informative and professional.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={confirmRequest}
                                        className="w-full h-[54px] bg-[#0F172A] text-white font-bold rounded-xl hover:bg-black transition-all"
                                    >
                                        Confirm & Send Request
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
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

            {/* Success Notification */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-[400px]"
                    >
                        <div className="bg-[#0F172A] text-white p-5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-[15px]">Request sent successfully!</p>
                                <p className="text-slate-400 text-xs">The business will review your request soon.</p>
                            </div>
                            <button onClick={() => setIsSuccess(false)} className="ml-auto text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
