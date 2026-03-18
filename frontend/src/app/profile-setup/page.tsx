"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Instagram,
    Globe,
    Phone,
    Briefcase,
    X,
    Plus,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import api from "@/api/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import ProtectedRoute from "@/components/protected-route";

const categories = [
    "Retail", "Restaurant", "Education", "Real Estate", "Fashion",
    "Fitness", "Digital Services", "Coaching", "Startup", "Other"
];

export default function ProfileSetup() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        businessName: "",
        category: "",
        description: "",
        city: "",
        state: "",
        instagram: "",
        website: "",
        whatsapp: "",
    });

    useEffect(() => {
        if (user) {
            const business = user.businesses?.[0];
            setFormData({
                businessName: business?.name || "",
                category: "", // Add category to schema if needed
                description: business?.description || "",
                city: "", 
                state: "",
                instagram: "",
                website: "",
                whatsapp: "",
            });
            if (business?.logo) setLogo(business.logo);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (e.g., 5MB limit)
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_SIZE) {
                toast.error(`Image size too large! Max limit is 5MB. (Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') setLogo(reader.result as string);
                else setBanner(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!logo) {
            toast.error("Please upload a business logo");
            return;
        }
        if (!banner) {
            toast.error("Please upload a promotion banner");
            return;
        }

        setIsLoading(true);
        try {
            await api.put('/users/profile', {
                ...formData,
                logoUrl: logo,
                bannerUrl: banner
            });
            await refreshUser();
            setIsSuccess(true);
            toast.success("Profile fully configured!");
            setTimeout(() => {
                router.push("/profile-setup/final");
            }, 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save profile");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
    const labelClasses = "block text-[14px] font-semibold text-[#111111] mb-2";

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFF] py-12 px-4 md:px-8">
            <div className="max-w-[900px] mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[32px] font-bold text-[#111111] mb-2"
                    >
                        Complete Your Business Profile
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[#555555] text-[16px]"
                    >
                        Add your business details and promotional banner in one skip-ready step.
                    </motion.p>
                </div>

                {/* Progress Indicator (Simplified) */}
                <div className="flex items-center justify-center mb-12 gap-4 md:gap-8">
                    {[
                        { id: 1, label: "Profile & Banner", active: true },
                        { id: 2, label: "Final Step", active: false }
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] border-2 transition-all ${s.active
                                    ? "bg-[#1E73E8] border-[#1E73E8] text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white border-[#E5E7EB] text-[#555555]"
                                    }`}>
                                    {s.id}
                                </div>
                                <span className={`text-[13px] font-medium hidden sm:block ${s.active ? "text-[#1E73E8]" : "text-[#555555]"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 1 && (
                                <div className="w-12 md:w-24 h-[2px] mx-2 bg-[#E5E7EB]" />
                            )}
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[20px] p-8 md:p-10 shadow-xl shadow-blue-900/5 relative"
                >
                    {/* Success Overlay */}
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-50 bg-white/95 rounded-[20px] flex items-center justify-center p-8 text-center border-2 border-green-500/30"
                            >
                                <div className="max-w-[400px]">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#111111] mb-2">Everything's set!</h3>
                                    <p className="text-[#555555] mb-6">Your business is ready for promotion. Redirecting to your dashboard...</p>
                                    <div className="flex justify-center">
                                        <div className="w-32 h-1.5 bg-green-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ x: "-100%" }}
                                                animate={{ x: 0 }}
                                                transition={{ duration: 2, ease: "linear" }}
                                                className="w-full h-full bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Section 1: Business Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-[#1E73E8]/10 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-[#1E73E8]" />
                                </div>
                                <h2 className="text-xl font-bold text-[#111111]">Business Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Business Name</label>
                                    <input
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your business name"
                                        className={inputClasses}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Business Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>City</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Mumbai"
                                            className={inputClasses}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>State</label>
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Maharashtra"
                                            className={inputClasses}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Business Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Tell other businesses what your company does."
                                        className={`${inputClasses} h-32 py-3 resize-none`}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClasses}>WhatsApp Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleInputChange}
                                                placeholder="e.g. +91 9876543210"
                                                className={`${inputClasses} pl-11`}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Instagram Username</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleInputChange}
                                                placeholder="e.g. @business_handle"
                                                className={`${inputClasses} pl-11`}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Website URL</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                placeholder="e.g. www.business.com"
                                                className={`${inputClasses} pl-11`}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-[#E5E7EB]" />

                        {/* Section 2: Banner & Logo Upload */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-[#2FA7F5]/10 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-[#2FA7F5]" />
                                </div>
                                <h2 className="text-xl font-bold text-[#111111]">Design Assets</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Logo Dropzone */}
                                <div>
                                    <label className={labelClasses}>Business Logo</label>
                                    <div
                                        onClick={() => !isLoading && logoInputRef.current?.click()}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 h-[200px] transition-all flex flex-col items-center justify-center ${logo ? "border-[#1E73E8] bg-[#1E73E8]/5" : "border-[#E5E7EB] hover:border-[#1E73E8] hover:bg-[#F8FAFF]"
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                                        {logo ? (
                                            <div className="relative">
                                                <Image src={logo} alt="Logo" width={100} height={100} className="rounded-xl shadow-md border-2 border-white" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setLogo(null); }} className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Plus className="w-8 h-8 text-[#1E73E8] mx-auto mb-2" />
                                                <p className="text-[14px] font-semibold text-[#111111]">Add Logo</p>
                                                <p className="text-[12px] text-[#94A3B8]">512 x 512 Square</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Banner Dropzone */}
                                <div>
                                    <label className={labelClasses}>Promotion Banner</label>
                                    <div
                                        onClick={() => !isLoading && bannerInputRef.current?.click()}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 h-[200px] transition-all flex flex-col items-center justify-center ${banner ? "border-[#1E73E8] bg-[#1E73E8]/5" : "border-[#E5E7EB] hover:border-[#1E73E8] hover:bg-[#F8FAFF]"
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
                                        {banner ? (
                                            <div className="relative w-full h-full">
                                                <Image src={banner} alt="Banner" fill className="object-cover rounded-xl" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setBanner(null); }} className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg z-10"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="w-8 h-8 text-[#1E73E8] mx-auto mb-2" />
                                                <p className="text-[14px] font-semibold text-[#111111]">Add Banner</p>
                                                <p className="text-[12px] text-[#94A3B8]">1080 x 1920 Status Size</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-[#E5E7EB]" />

                        {/* CTA Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 20px 40px -10px rgba(30,115,232,0.3)" } : {}}
                                whileTap={!isLoading ? { scale: 0.99 } : {}}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-[54px] bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold text-lg rounded-[14px] shadow-xl shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving Profile...
                                    </>
                                ) : (
                                    "Save Profile & Get Started →"
                                )}
                            </motion.button>
                            <p className="text-center text-[13px] text-[#94A3B8] mt-4">
                                By clicking save, you agree to our cross-promotion terms.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
