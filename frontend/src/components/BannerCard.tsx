"use client";

import Image from "next/image";
import { 
    Trash2, 
    Eye, 
    Power,
    Download,
    MousePointer2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BannerCardProps {
    banner: {
        id: string;
        imageUrl: string;
        title: string | null;
        createdAt: string;
    };
    onDelete: (id: string) => void;
}

export default function BannerCard({ banner, onDelete }: BannerCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden group flex flex-col"
        >
            {/* Preview Area */}
            <div className="relative aspect-[9/16] w-full bg-slate-100 overflow-hidden">
                <Image
                    src={banner.imageUrl}
                    alt={banner.title || "Business Banner"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(banner.id)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-110 transition-transform"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-1 truncate" title={banner.title || "Untitled"}>
                        {banner.title || "Untitled Banner"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span>Uploaded on {new Date(banner.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(banner.id)}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Banner
                </button>
            </div>
        </motion.div>
    );
}
