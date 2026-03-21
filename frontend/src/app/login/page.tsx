"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/auth-layout";
import api from "@/api/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "react-hot-toast";

type AuthMode = "password" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const signupSuccess = searchParams.get("signup") === "success";
    
    const [authMode, setAuthMode] = useState<AuthMode>("password");
    const [otpStep, setOtpStep] = useState(1); 
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setError(null);
    };

    const handleModeToggle = () => {
        setAuthMode(prev => prev === "password" ? "otp" : "password");
        setOtpStep(1);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (authMode === "otp" && otpStep === 1) {
            setOtpStep(2);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            login(response.data.access_token, response.data.user);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Invalid email or password";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
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

            {signupSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-[14px] font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    Account created successfully! Please login to continue.
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[14px] font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            {isMounted && (
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
                                            suppressHydrationWarning
                                            required
                                            disabled={isLoading}
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
                                            suppressHydrationWarning
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" } : {}}
                                    whileTap={!isLoading ? { scale: 0.99 } : {}}
                                    type="submit"
                                    suppressHydrationWarning={true}
                                    disabled={isLoading}
                                    className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Login to Dashboard"
                                    )}
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
                                                    suppressHydrationWarning
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-[#64748B] text-center italic">
                                            We’ll send a one-time verification code.
                                        </p>
                                        <motion.button
                                            whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" } : {}}
                                            whileTap={!isLoading ? { scale: 0.99 } : {}}
                                            type="submit"
                                            suppressHydrationWarning={true}
                                            disabled={isLoading}
                                            className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => setOtpStep(1)}
                                                suppressHydrationWarning={true}
                                                disabled={isLoading}
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
                                                    suppressHydrationWarning
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <p className="mt-1.5 ml-1 text-[12px] text-[#555555]">
                                                Code expires in 2 minutes.
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 10px 20px -5px rgba(30,115,232,0.3)" } : {}}
                                            whileTap={!isLoading ? { scale: 0.99 } : {}}
                                            type="submit"
                                            suppressHydrationWarning={true}
                                            disabled={isLoading}
                                            className={`w-full h-12 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold rounded-[12px] shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                "Verify & Login"
                                            )}
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
            )}

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
            </div>
        </AuthLayout>
    );
}
