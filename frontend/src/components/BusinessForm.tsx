"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    Briefcase, 
    MapPin, 
    Instagram, 
    Phone, 
    Loader2, 
    CheckCircle2,
    Store,
    AlignLeft,
    Camera,
    Image as ImageIcon,
    Upload,
    X
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { createBusiness, updateBusiness, uploadBusinessImage, BusinessData } from "@/api/business.api";
import { useAuth } from "@/context/auth-context";

const categories = [
    "Retail", "Restaurant", "Education", "Real Estate", "Fashion",
    "Fitness", "Digital Services", "Coaching", "Startup", "Other"
];

interface BusinessFormProps {
    initialData?: BusinessData | null;
    isEditMode?: boolean;
}

export default function BusinessForm({ initialData, isEditMode = false }: BusinessFormProps) {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    
    const [formData, setFormData] = useState<BusinessData>({
        name: "",
        category: "",
        description: "",
        location: "",
        instagram: "",
        whatsapp: "",
        logoUrl: "",
        bannerUrl: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                category: initialData.category || "",
                description: initialData.description || "",
                location: initialData.location || "",
                instagram: initialData.instagram || "",
                whatsapp: initialData.whatsapp || "",
                logoUrl: initialData.logoUrl || initialData.logo || "",
                bannerUrl: initialData.bannerUrl || "",
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const mountPreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    };

    const simulateUpload = async (file: File, type: 'logo' | 'banner') => {
        if (type === 'logo') setUploadingLogo(true);
        else setUploadingBanner(true);

        try {
            const response = await uploadBusinessImage(file);
            const imageUrl = response.secure_url;
            
            setFormData(prev => ({
                ...prev,
                [type === 'logo' ? 'logoUrl' : 'bannerUrl']: imageUrl
            }));
            
            toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
        } catch (error) {
            toast.error(`Failed to upload ${type}`);
        } finally {
            if (type === 'logo') setUploadingLogo(false);
            else setUploadingBanner(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            simulateUpload(file, type);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditMode) {
                await updateBusiness(formData);
                toast.success("Business updated successfully!");
            } else {
                await createBusiness(formData);
                toast.success("Business created successfully!");
            }
            
            await refreshUser();
            
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (error: any) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full h-12 px-11 rounded-xl border border-[#E5E7EB] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
    const labelClasses = "block text-[14px] font-semibold text-[#111111] mb-2";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]";

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Branding Section */}
            <div className="space-y-6">
                <label className={labelClasses}>Business Branding</label>
                
                {/* Banner Upload */}
                <div className="relative group">
                    <div 
                        className={`relative h-48 w-full rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
                            ${formData.bannerUrl ? 'border-transparent' : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#1E73E8]/30'}`}
                        onClick={() => document.getElementById('banner-upload')?.click()}
                    >
                        {formData.bannerUrl ? (
                            <>
                                <Image 
                                    src={formData.bannerUrl} 
                                    alt="Banner Preview" 
                                    fill 
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/90 p-2 rounded-full text-[#111111]">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-3 rounded-full bg-white shadow-sm mb-2">
                                    <ImageIcon className="w-6 h-6 text-[#1E73E8]" />
                                </div>
                                <span className="text-[14px] font-medium text-[#475569]">Upload Business Banner</span>
                                <span className="text-[12px] text-[#94A3B8]">Recommended 16:9 ratio</span>
                            </>
                        )}
                        
                        {uploadingBanner && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-8 h-8 animate-spin text-[#1E73E8] mb-2" />
                                <span className="text-[14px] font-semibold text-[#1E73E8]">Uploading Banner...</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Logo Upload (Floating on Banner) */}
                    <div className="absolute -bottom-6 left-8">
                        <div 
                            className={`relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white cursor-pointer group/logo transition-transform hover:scale-105
                                ${formData.logoUrl ? '' : 'flex flex-col items-center justify-center border-dashed border-[#E5E7EB]'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById('logo-upload')?.click();
                            }}
                        >
                            {formData.logoUrl ? (
                                <>
                                    <Image 
                                        src={formData.logoUrl} 
                                        alt="Logo Preview" 
                                        fill 
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="w-4 h-4 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-2">
                                    <Upload className="w-5 h-5 text-[#94A3B8] mb-1" />
                                    <span className="text-[10px] font-bold text-[#94A3B8]">LOGO</span>
                                </div>
                            )}

                            {uploadingLogo && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                                    <Loader2 className="w-5 h-5 animate-spin text-[#1E73E8]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden File Inputs */}
                <input 
                    type="file" 
                    id="banner-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => onFileChange(e, 'banner')}
                />
                <input 
                    type="file" 
                    id="logo-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => onFileChange(e, 'logo')}
                />

                <div className="h-4" /> {/* Spacer for the floating logo */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#F1F5F9]">
                {/* Business Name */}
                <div className="md:col-span-2">
                    <label className={labelClasses}>Business Name</label>
                    <div className="relative">
                        <Store className={iconClasses} />
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your business name"
                            className={inputClasses}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className={labelClasses}>Business Category</label>
                    <div className="relative">
                        <Briefcase className={iconClasses} />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`${inputClasses} appearance-none`}
                            required
                            disabled={isLoading}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className={labelClasses}>Location</label>
                    <div className="relative">
                        <MapPin className={iconClasses} />
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Mumbai, India"
                            className={inputClasses}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className={labelClasses}>Business Description</label>
                    <div className="relative">
                        <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-[#94A3B8]" />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Tell us about your business..."
                            className={`${inputClasses} h-32 py-3 pl-11 resize-none`}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* WhatsApp */}
                <div>
                    <label className={labelClasses}>WhatsApp Number</label>
                    <div className="relative">
                        <Phone className={iconClasses} />
                        <input
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            placeholder="e.g. +91 9876543210"
                            className={inputClasses}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Instagram */}
                <div>
                    <label className={labelClasses}>Instagram Username</label>
                    <div className="relative">
                        <Instagram className={iconClasses} />
                        <input
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="e.g. @business_handle"
                            className={inputClasses}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

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
                            {isEditMode ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        <>
                            {isEditMode ? "Update Business Profile" : "Create Business Profile"}
                            <CheckCircle2 className="w-5 h-5 ml-2" />
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
}
