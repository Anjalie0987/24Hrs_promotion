"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Rocket, ArrowRight, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

export default function FinalStepPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4">
                <div className="max-w-[600px] w-full bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-blue-900/10 text-center relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8]" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1E73E8]/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#2FA7F5]/5 rounded-full blur-3xl" />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-4 leading-tight"
                    >
                        You're All Set!
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-[#555555] text-[18px] mb-10 leading-relaxed"
                    >
                        Your business profile is fully configured. You are now ready to start promoting and growing your business with the community.
                    </motion.p>

                    {/* Features Recap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                        {[
                            { icon: Rocket, label: "Daily Promotions", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: Star, label: "Track Engagement", color: "text-amber-500", bg: "bg-amber-50" },
                            { icon: ShieldCheck, label: "Verified Profile", color: "text-green-500", bg: "bg-green-50" },
                            { icon: ArrowRight, label: "Community Access", color: "text-purple-500", bg: "bg-purple-50" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                            >
                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-slate-700 text-[14px]">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(30,115,232,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-14 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                            >
                                Go to Dashboard <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    <p className="mt-6 text-slate-400 text-[13px] font-medium">
                        Welcome to the 24-Hour Promotion Family!
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
