"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, ArrowLeft, ShieldCheck } from "lucide-react";

type AuthMode = "password" | "otp";

export default function LoginPage() {
    const [authMode, setAuthMode] = useState<AuthMode>("password");
    const [otpStep, setOtpStep] = useState(1); // 1 = Email, 2 = Code
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleModeToggle = () => {
        setAuthMode(prev => prev === "password" ? "otp" : "password");
        setOtpStep(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === "otp" && otpStep === 1) {
            setOtpStep(2);
            return;
        }
        console.log("Login attempt:", { authMode, formData });
    };

    const inputClasses = "w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#E6F0FF] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]";

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to manage your promotions, track engagement, and grow your business daily."
        >
            <div className="mb-6 flex p-1 bg-[#F0F6FF] rounded-xl">
                <button
                    onClick={() => { setAuthMode("password"); setOtpStep(1); }}
                    suppressHydrationWarning={true}
                    className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${authMode === "password" ? "bg-white text-[#1E73E8] shadow-sm" : "text-[#64748B] hover:text-[#111111]"}`}
                >
                    Password
                </button>
                <button
                    onClick={() => setAuthMode("otp")}
                    suppressHydrationWarning={true}
                    className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${authMode === "otp" ? "bg-white text-[#1E73E8] shadow-sm" : "text-[#64748B] hover:text-[#111111]"}`}
                >
                    OTP
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.form
                    key={authMode + (authMode === "otp" ? otpStep : "")}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {authMode === "password" ? (
                        <>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className={iconClasses} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@business.com"
                                        className={inputClasses}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="block text-[14px] font-semibold text-[#111111]">Password</label>
                                    <Link href="#" className="text-[13px] font-medium text-[#1E73E8] hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className={iconClasses} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className={inputClasses}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                suppressHydrationWarning={true}
                                className="w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300"
                            >
                                Login to Dashboard
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {otpStep === 1 ? (
                                <>
                                    <div>
                                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className={iconClasses} />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="name@business.com"
                                                className={inputClasses}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-[#64748B] text-center italic">
                                        We’ll send a one-time verification code.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        suppressHydrationWarning={true}
                                        className="w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300"
                                    >
                                        Send OTP
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep(1)}
                                            suppressHydrationWarning={true}
                                            className="text-[#1E73E8] hover:bg-[#F0F6FF] p-1 rounded-lg transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-[13px] text-[#64748B]">Sending code to {formData.email}</span>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Verification Code</label>
                                        <div className="relative">
                                            <ShieldCheck className={iconClasses} />
                                            <input
                                                type="text"
                                                name="otp"
                                                placeholder="Enter 6-digit code"
                                                className={inputClasses}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <p className="mt-1.5 ml-1 text-[12px] text-[#555555]">
                                            Code expires in 2 minutes.
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        suppressHydrationWarning={true}
                                        className="w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300"
                                    >
                                        Verify & Login
                                    </motion.button>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            suppressHydrationWarning={true}
                                            className="text-[13px] font-medium text-[#1E73E8] hover:underline"
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </motion.form>
            </AnimatePresence>

            <div className="text-center mt-8 border-t border-[#F0F6FF] pt-6">
                <p className="text-[14px] text-[#555555]">
                    Don’t have an account?{" "}
                    <Link href="/register" className="text-[#1E73E8] font-semibold hover:underline">
                        Create one
                    </Link>
                </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <p className="text-[12px] font-medium text-[#64748B]">Secure login. Your data is protected.</p>
                </div>

                {/* Dev Bypass Button */}
                {isMounted && (
                    <Link
                        href="/profile-setup"
                        suppressHydrationWarning={true}
                        className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-[#1E73E8] transition-colors border border-dashed border-slate-200 hover:border-[#1E73E8]/30 px-3 py-1.5 rounded-lg"
                    >
                        Dev Bypass: Profile Setup
                    </Link>
                )}
            </div>
        </AuthLayout>
    );
}
