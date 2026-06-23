"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/api/api";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        businessName: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError(null);
    };

    const handleFinalSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/signup', {
                email: formData.email,
                password: formData.password,
                firstName: formData.businessName,
                lastName: "",
            });

            toast.success("Account created! Please login.");
            router.push("/login?signup=success");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create account");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full h-12 px-4 rounded-[12px] border border-[#E6F0FF] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";

    if (!mounted) {
        return (
            <AuthLayout
                title="Create Your Business Account"
                subtitle="Start your 24-hour cross promotion journey and grow your business through structured status marketing."
                description="Join a trusted network of businesses that promote each other daily through WhatsApp and Instagram stories — with measurable engagement tracking."
            >
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-[#1E73E8]/30 border-t-[#1E73E8] rounded-full animate-spin"></div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create Your Business Account"
            subtitle="Start your 24-hour cross promotion journey and grow your business through structured status marketing."
            description="Join a trusted network of businesses that promote each other daily through WhatsApp and Instagram stories — with measurable engagement tracking."
        >
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[14px] font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleFinalSignup} 
                className="space-y-4"
            >
                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Email Address</label>
                    <input
                        suppressHydrationWarning
                        type="email"
                        name="email"
                        placeholder="name@business.com"
                        className={inputClasses}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Business Name</label>
                    <input
                        suppressHydrationWarning
                        type="text"
                        name="businessName"
                        placeholder="e.g. Acme Coffee Roasters"
                        className={inputClasses}
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Mobile Number (Optional)</label>
                    <input
                        suppressHydrationWarning
                        type="tel"
                        name="mobile"
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Create Password</label>
                        <input
                            suppressHydrationWarning
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className={inputClasses}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <p className="mt-1.5 ml-1 text-[12px] text-[#555555]">
                            Minimum 6 characters.
                        </p>
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Confirm Password</label>
                        <input
                            suppressHydrationWarning
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            className={inputClasses}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1 ml-1">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        className="w-4 h-4 rounded-md border-[#E6F0FF] text-[#1E73E8] focus:ring-[#1E73E8]"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="acceptTerms" className="text-[13px] text-[#555555]">
                        I accept the <Link href="#" className="text-[#1E73E8] hover:underline">Terms & Conditions</Link>
                    </label>
                </div>

                <div className="pt-2">
                    <motion.button
                        whileHover={!isLoading ? { scale: 1.01 } : {}}
                        whileTap={!isLoading ? { scale: 0.99 } : {}}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Complete Account"}
                    </motion.button>
                </div>
            </motion.form>

            <div className="text-center mt-6">
                <p className="text-[14px] text-[#555555]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#1E73E8] font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
