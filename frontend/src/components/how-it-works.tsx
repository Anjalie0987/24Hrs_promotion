"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Upload,
    Handshake,
    Clock,
    BarChart3,
    CheckCircle2
} from "lucide-react";

const steps = [
    {
        title: "Upload Your Promotional Banner",
        description: "Create or upload your business banner in story format.",
    },
    {
        title: "Connect with Other Businesses",
        description: "Send a promotion request to businesses available for cross-promotion.",
    },
    {
        title: "Mutual Approval",
        description: "Both businesses approve the promotion before it goes live.",
    },
    {
        title: "Promote for 24 Hours",
        description: "Download the watermarked banner and share it on your WhatsApp, Instagram, or Facebook status.",
    },
    {
        title: "Track Real Engagement",
        description: "Monitor clicks, QR scans, and performance directly from your dashboard.",
    },
];

export function HowItWorks() {
    return (
        <section className="bg-white py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-[34px] md:text-[38px] font-semibold text-[#111111] mb-4">
                        How 24-HR Status Promotion Works
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] mx-auto rounded-full" />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Side: Illustration Area */}
                    <div className="w-full lg:w-[45%] relative">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Soft Decor Shape */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#1E73E8]/5 blur-3xl rounded-full -z-10" />

                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/work.png"
                                    alt="24HR Status Promotion Workflow"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto drop-shadow-2xl"
                                />

                                {/* Floating UI Elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 right-[10%] bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-[#1E73E8]"
                                >
                                    <Upload className="w-6 h-6" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute top-[30%] -left-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-[#2FA7F5]"
                                >
                                    <Handshake className="w-6 h-6" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-[20%] -right-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-[#0F5FCC]"
                                >
                                    <Clock className="w-6 h-6" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    className="absolute -bottom-4 left-[20%] bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-[#1E73E8]"
                                >
                                    <BarChart3 className="w-6 h-6" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Side: Step Structure */}
                    <div className="w-full lg:w-[55%] relative">
                        <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-[#1E73E8]/10 hidden md:block" />

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative pl-0 md:pl-16 group"
                                >
                                    {/* Step Number Badge */}
                                    <div className="md:absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#2FA7F5] to-[#1E73E8] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 transition-transform group-hover:scale-110 mb-4 md:mb-0">
                                        {index + 1}
                                    </div>

                                    {/* Content Card (Transparent / Minimal) */}
                                    <div className="p-2 transition-all group-hover:translate-x-2">
                                        <h3 className="text-[18px] font-semibold text-[#111111] mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-[15px] md:text-[16px] text-[#555555] leading-relaxed max-w-[420px]">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
