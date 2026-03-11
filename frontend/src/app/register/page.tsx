"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import { motion } from "framer-motion";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup attempt:", formData);
        // Implementation for signup would go here
    };

    const inputClasses = "w-full h-12 px-4 rounded-[12px] border border-[#E6F0FF] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";

    return (
        <AuthLayout
            title="Create Your Business Account"
            subtitle="Start your 24-hour cross promotion journey and grow your business through structured status marketing."
            description="Join a trusted network of businesses that promote each other daily through WhatsApp and Instagram stories — with measurable engagement tracking."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        placeholder="e.g. Acme Coffee Roasters"
                        className={inputClasses}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@business.com"
                        className={inputClasses}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Mobile Number (Optional)</label>
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Create Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className={inputClasses}
                            onChange={handleChange}
                            required
                        />
                        <p className="mt-1.5 ml-1 text-[12px] text-[#555555]">
                            Minimum 8 characters required.
                        </p>
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            className={inputClasses}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1 ml-1">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        className="w-4 h-4 rounded-md border-[#E6F0FF] text-[#1E73E8] focus:ring-[#1E73E8]"
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="acceptTerms" className="text-[13px] text-[#555555]">
                        I accept the <Link href="#" className="text-[#1E73E8] hover:underline">Terms & Conditions</Link>
                    </label>
                </div>

                <div className="pt-2">
                    <motion.button
                        whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] hover:from-[#1E73E8] hover:to-[#0F5FCC] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300"
                    >
                        Create Free Account
                    </motion.button>
                    <p className="mt-3 text-center text-[13px] text-[#555555]">
                        Free to join. No credit card required.
                    </p>
                </div>
            </form>

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
