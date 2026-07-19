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
        originalImageUrl: string;
        watermarkedImageUrl: string | null;
        title: string | null;
        createdAt: string;
    };
    onDelete: (id: string) => void;
    onView?: (url: string) => void;
}

export default function BannerCard({ banner, onDelete, onView }: BannerCardProps) {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const imageUrl = banner.watermarkedImageUrl || banner.originalImageUrl;
            const downloadUrl = imageUrl.includes('/upload/') 
                ? imageUrl.replace('/upload/', '/upload/fl_attachment/')
                : imageUrl;
            
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${banner.title || "banner"}.png`;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden group flex flex-col"
        >
            {/* Preview Area */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden border-b border-slate-200">
                <Image
                    src={banner.watermarkedImageUrl || banner.originalImageUrl}
                    alt={banner.title || "Business Banner"}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Actions (Desktop Only) */}
                <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button 
                        onClick={() => onView && onView(banner.watermarkedImageUrl || banner.originalImageUrl)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-xl hover:scale-110 transition-transform"
                    >
                        <Download className="w-5 h-5" />
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

                {/* Mobile Actions (Visible only on mobile) */}
                <div className="mt-auto md:hidden flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={() => onView && onView(banner.watermarkedImageUrl || banner.originalImageUrl)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Save</span>
                    </button>
                    <button
                        onClick={() => onDelete(banner.id)}
                        className="flex-none flex items-center justify-center p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
