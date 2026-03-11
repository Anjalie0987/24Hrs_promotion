"use client";

import { useState, useRef } from "react";
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
    Plus
} from "lucide-react";

const categories = [
    "Retail", "Restaurant", "Education", "Real Estate", "Fashion",
    "Fitness", "Digital Services", "Coaching", "Startup", "Other"
];

export default function ProfileSetup() {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            router.push("/onboarding/banner");
        }, 2000);
    };

    const inputClasses = "w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
    const labelClasses = "block text-[14px] font-semibold text-[#111111] mb-2";

    return (
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
                        Add your business details so other companies can discover and promote your brand.
                    </motion.p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-12 gap-4 md:gap-8">
                    {[
                        { id: 1, label: "Profile Setup" },
                        { id: 2, label: "Upload Banner" },
                        { id: 3, label: "Dashboard" }
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] border-2 transition-all ${s.id === 1
                                    ? "bg-[#1E73E8] border-[#1E73E8] text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white border-[#E5E7EB] text-[#555555]"
                                    }`}>
                                    {s.id}
                                </div>
                                <span className={`text-[13px] font-medium hidden sm:block ${s.id === 1 ? "text-[#1E73E8]" : "text-[#555555]"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && (
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
                                className="absolute inset-0 z-50 bg-white/95 rounded-[20px] flex items-center justify-center p-8 text-center"
                            >
                                <div className="max-w-[400px]">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#111111] mb-2">Profile saved!</h3>
                                    <p className="text-[#555555] mb-6">Taking you to the banner upload step...</p>
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
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-[#E5E7EB]" />

                        {/* Section 2: Social Media Links */}
                        <section>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-[#2FA7F5]/10 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-[#2FA7F5]" />
                                </div>
                                <h2 className="text-xl font-bold text-[#111111]">Social Media Links</h2>
                            </div>
                            <p className="text-[14px] text-[#555555] mb-8 ml-13">Optional but recommended for authenticity.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div>
                                    <label className={labelClasses}>Instagram Profile URL</label>
                                    <div className="relative">
                                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                        <input
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleInputChange}
                                            placeholder="instagram.com/yourhandle"
                                            className={`${inputClasses} pl-11`}
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
                                            placeholder="www.yourbusiness.com"
                                            className={`${inputClasses} pl-11`}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>WhatsApp Business Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                        <input
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className={`${inputClasses} pl-11`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-[#E5E7EB]" />

                        {/* Section 3: Logo Upload */}
                        <section>
                            <h2 className="text-xl font-bold text-[#111111] mb-6">Upload Business Logo</h2>

                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center ${logo ? "border-[#1E73E8] bg-[#1E73E8]/5" : "border-[#E5E7EB] hover:border-[#1E73E8] hover:bg-[#F8FAFF]"
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />

                                {logo ? (
                                    <div className="relative">
                                        <Image src={logo} alt="Logo Preview" width={120} height={120} className="rounded-xl shadow-md border-2 border-white" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setLogo(null); }}
                                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Plus className="w-8 h-8 text-[#1E73E8]" />
                                        </div>
                                        <p className="font-semibold text-[#111111]">Upload your business logo</p>
                                        <p className="text-[13px] text-[#555555] mt-1">Recommended size: 512 × 512 (square)</p>
                                    </>
                                )}
                            </div>
                            <p className="text-[13px] text-[#64748B] mt-4 italic text-center">
                                Your logo will appear on your business profile and promotions.
                            </p>
                        </section>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -10px rgba(30,115,232,0.3)" }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full h-[54px] bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold text-lg rounded-[14px] shadow-xl shadow-blue-500/20 transition-all duration-300"
                            >
                                Save Profile &amp; Continue →
                            </motion.button>
                            <p className="text-center text-[13px] text-[#94A3B8] mt-3">Next: Upload your promotion banner</p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
