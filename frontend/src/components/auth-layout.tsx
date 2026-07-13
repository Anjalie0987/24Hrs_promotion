"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    description?: string;
}

const benefits = [
    "Daily business visibility",
    "Mutual promotion system",
    "24-hour commitment lock",
    "Engagement tracking",
    "Trust-based business network"
];

export function AuthLayout({ children, title, subtitle, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFF]">

            {/* Left Side: Side Panel (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-[#F0F6FF] relative overflow-hidden">
                {/* Background Decorative Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1E73E8]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2FA7F5]/5 blur-[120px] rounded-full" />

                <div className="max-w-[440px] relative z-10">
                    <Link href="/" className="inline-block mb-10">
                        <Image
                            src="/24HR_logo.png"
                            alt="24HR Status Promotion"
                            width={56}
                            height={56}
                            className="rounded-xl shadow-lg h-auto"
                            style={{ width: '56px' }}
                        />
                    </Link>

                    <h2 className="text-[32px] font-bold text-[#111111] leading-tight mb-8">
                        Why Join 24HR Status Promotion?
                    </h2>

                    <ul className="space-y-5 mb-12">
                        {benefits.map((benefit, i) => (
                            <motion.li
                                key={benefit}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-[16px] text-[#475569] font-medium"
                            >
                                <div className="shrink-0 w-6 h-6 rounded-full bg-[#1E73E8]/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-[#1E73E8]" />
                                </div>
                                {benefit}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Subtle Illustration Placeholder (Floating effect) */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="rounded-2xl overflow-hidden shadow-2xl border border-white/20"
                    >
                        <Image
                            src="/Hero.png"
                            alt="Business Growth"
                            width={440}
                            height={300}
                            className="w-full h-auto object-cover opacity-90"
                            style={{ height: 'auto' }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Auth Card */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Logo Only */}
                <div className="lg:hidden mb-8">
                    <Link href="/">
                        <Image 
                            src="/24HR_logo.png" 
                            alt="Logo" 
                            width={48} 
                            height={48} 
                            className="rounded-lg shadow-sm h-auto" 
                            style={{ width: '48px' }}
                        />
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[420px] bg-white rounded-[20px] shadow-xl shadow-blue-900/5 p-9 border border-[#E5E7EB]"
                >
                    <div className="mb-8">
                        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111111] leading-tight mb-3">
                            {title}
                        </h1>
                        <p className="text-[15px] sm:text-[16px] text-[#555555] leading-relaxed mb-4">
                            {subtitle}
                        </p>
                        {description && (
                            <p className="text-[14px] text-[#666666] leading-relaxed pb-4 border-b border-[#F0F6FF]">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </motion.div>

                {/* Trust Line */}
                <div className="mt-8 text-center px-4">
                    <p className="text-[13px] text-[#64748B] leading-relaxed">
                        No spam. No hidden charges.<br />
                        Only real business collaborations.
                    </p>
                </div>
            </div>
        </div>
    );
}
