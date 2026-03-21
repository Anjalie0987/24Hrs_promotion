"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Eye,
    ImageIcon,
    AlertCircle,
    X,
    PlusCircle,
    Loader2,
    Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/protected-route";
import BannerCard from "@/components/BannerCard";
import { getMyBanners, uploadBanner, deleteBanner } from "@/api/banner.api";
import { toast } from "react-hot-toast";

export default function MyBannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [bannerTitle, setBannerTitle] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const data = await getMyBanners();
            setBanners(data);
        } catch (error) {
            toast.error("Failed to load banners");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!previewUrl) return;

        try {
            setIsUploading(true);
            // In a real app, you'd upload the file to S3/Cloudinary first.
            // Since we don't have that yet, we'll send the data URL as a "mock" imageUrl 
            // OR use a placeholder if the data URL is too large for the DB.
            // For this demo, let's use the preview URL (data URL) but keep it small if possible.
            await uploadBanner({ 
                imageUrl: previewUrl, 
                title: bannerTitle || "New Banner" 
            });
            
            toast.success("Banner uploaded successfully!");
            setShowUploadModal(false);
            setPreviewUrl(null);
            setSelectedFile(null);
            setBannerTitle("");
            fetchBanners();
        } catch (error) {
            toast.error("Failed to upload banner");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBanner(id);
            toast.success("Deleted successfully");
            setBanners(prev => prev.filter(b => b.id !== id));
            setShowDeleteModal(null);
        } catch (error) {
            toast.error("Failed to delete banner");
        }
    };

    return (
        <ProtectedRoute>
            <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">My Promotion Banners</h1>
                    <p className="text-[#64748B] text-lg">Manage your business content and track performance.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Upload New Banner
                </button>
            </div>

            {/* Banners Grid */}
            {isLoading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            ) : banners.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">No banners yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Upload your first vertical story banner to start promoting.</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-8 py-3 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Upload First Banner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map((banner) => (
                        <BannerCard 
                            key={banner.id} 
                            banner={banner} 
                            onDelete={(id) => setShowDeleteModal(id)} 
                        />
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-[500px] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-[#0F172A]">Upload Banner</h3>
                                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* File Dropzone/Preview */}
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "relative aspect-[9/16] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                                        previewUrl ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                                    )}
                                >
                                    {previewUrl ? (
                                        <>
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-white font-bold">Change Image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <p className="font-bold text-[#0F172A] mb-1">Click to upload</p>
                                            <p className="text-xs text-slate-500">Vertical (9:16) recommended</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        accept="image/*" 
                                        onChange={handleFileSelect}
                                    />
                                </div>

                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Banner Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Summer Sale 2024"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        value={bannerTitle}
                                        onChange={(e) => setBannerTitle(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={!previewUrl || isUploading}
                                    className="w-full h-14 bg-[#2563EB] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    {isUploading ? "Uploading..." : "Upload Banner"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-[400px] p-8 relative shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Delete Banner?</h3>
                                <p className="text-slate-500 leading-relaxed mb-8 text-sm">
                                    Are you sure? This action cannot be undone.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleDelete(showDeleteModal)}
                                        className="w-full h-[54px] bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(null)}
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
            </div>
        </ProtectedRoute>
    );
}
