"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/api/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        if (!formData.email) {
            setError("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: formData.email });
            toast.success("If the email is registered, an OTP was sent!");
            setStep(2);
            setCountdown(600); // 10 minutes
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to request OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formData.otp.length !== 6) {
            setError("OTP must be exactly 6 digits");
            return;
        }
        // Move to next step without making an API call, we verify during the reset
        setStep(3);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword,
            });

            toast.success("Password reset successfully! Please login.");
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. The OTP might be expired or invalid.");
            // If OTP is invalid, maybe go back to step 2
            if (err.response?.data?.message === "Invalid OTP" || err.response?.data?.message === "OTP has expired") {
                setStep(2);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full h-12 px-4 rounded-[12px] border border-[#E6F0FF] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";

    if (!mounted) {
        return (
            <AuthLayout
                title="Reset Your Password"
                subtitle="Securely recover access to your account."
                description="We'll send a one-time verification code to your email to help you set a new password."
            >
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-[#1E73E8]/30 border-t-[#1E73E8] rounded-full animate-spin"></div>
                </div>
            </AuthLayout>
        );
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Securely recover access to your account."
            description="We'll send a one-time verification code to your email to help you set a new password."
        >
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[14px] font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form 
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleSendOtp} 
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Email Address</label>
                            <input
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
                        <div className="pt-2">
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.01 } : {}}
                                whileTap={!isLoading ? { scale: 0.99 } : {}}
                                type="submit"
                                disabled={isLoading || !formData.email}
                                className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg transition-all duration-300 flex items-center justify-center ${isLoading || !formData.email ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Reset Code"}
                            </motion.button>
                        </div>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form 
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleVerifyOtp} 
                        className="space-y-4"
                    >
                        <div className="text-center mb-6">
                            <p className="text-[14px] text-[#555555]">We sent a 6-digit code to</p>
                            <p className="text-[15px] font-bold text-[#111111]">{formData.email}</p>
                            <button type="button" onClick={() => setStep(1)} className="text-[#1E73E8] text-[13px] hover:underline mt-1">Change email</button>
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1 text-center w-full">Enter Reset Code</label>
                            <input
                                type="text"
                                name="otp"
                                maxLength={6}
                                placeholder="------"
                                className={`${inputClasses} text-center tracking-[0.5em] font-mono text-[20px]`}
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <p className="text-[13px] text-[#555555]">
                                {countdown > 0 ? `Code expires in ${formatTime(countdown)}` : <span className="text-red-500">Code expired</span>}
                            </p>
                            <button 
                                type="button" 
                                disabled={countdown > 540 || isLoading} 
                                onClick={() => handleSendOtp()} 
                                className={`text-[13px] font-semibold ${countdown > 540 ? "text-[#94A3B8]" : "text-[#1E73E8] hover:underline"}`}
                            >
                                Resend Code
                            </button>
                        </div>

                        <div className="pt-2">
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.01 } : {}}
                                whileTap={!isLoading ? { scale: 0.99 } : {}}
                                type="submit"
                                disabled={isLoading || formData.otp.length !== 6}
                                className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg transition-all duration-300 flex items-center justify-center ${isLoading || formData.otp.length !== 6 ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify Code"}
                            </motion.button>
                        </div>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.form 
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleResetPassword} 
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="••••••••"
                                className={inputClasses}
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-1.5 ml-1 text-[12px] text-[#555555]">
                                Minimum 6 characters.
                            </p>
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-[#111111] mb-1.5 ml-1">Confirm New Password</label>
                            <input
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

                        <div className="pt-2">
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.01 } : {}}
                                whileTap={!isLoading ? { scale: 0.99 } : {}}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save New Password"}
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="text-center mt-6">
                <p className="text-[14px] text-[#555555]">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-[#1E73E8] font-semibold hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
