"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { getMyBusiness } from "@/api/business.api";

export function Hero() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCTAClick = async () => {
        if (!isAuthenticated) {
            router.push("/register");
            return;
        }

        setIsLoading(true);
        try {
            const business = await getMyBusiness();
            if (business && business.id) {
                router.push("/dashboard");
            } else {
                router.push("/profile-setup");
            }
        } catch (error) {
            console.error("Error checking business state:", error);
            // Fallback to profile-setup if API fails but user is authenticated
            router.push("/profile-setup");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative min-h-[80vh] flex items-center bg-[#F9FBFF] overflow-hidden pt-12 md:pt-0">
            {/* Subtle Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] bg-[#1E73E8] opacity-[0.03] blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                    {/* LEFT CONTENT (50%) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-[50%] max-w-[560px]"
                    >
                        <h1 className="text-[38px] md:text-[42px] font-semibold leading-[1.3] text-[#111111]">
                            Grow Your Business Daily with{" "}
                            <span className="bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] bg-clip-text text-transparent">
                                24-Hour Status Promotion
                            </span>
                        </h1>

                        <p className="mt-6 text-[16px] md:text-[17px] leading-[1.6] text-[#555555] max-w-[460px]">
                            The first barter-based promotion platform where businesses promote each other through stories and track real engagement across WhatsApp & social media.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-6 items-center">
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.03, boxShadow: "0 10px 25px -5px rgba(30, 115, 232, 0.3)" } : {}}
                                whileTap={!isLoading ? { scale: 0.98 } : {}}
                                onClick={handleCTAClick}
                                disabled={isLoading}
                                className={`px-8 py-4 rounded-[14px] bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-semibold shadow-lg shadow-blue-500/10 transition-all border border-white/10 flex items-center gap-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    "Start Free Promotion"
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE (50%) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="w-full lg:w-[50%] flex justify-center lg:justify-end"
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-[90%] max-w-[620px]"
                        >
                            <div className="relative rounded-[20px] overflow-hidden shadow-2xl border border-white/60 bg-white/40 backdrop-blur-sm p-2">
                                <Image
                                    src="/Hero.png"
                                    alt="24HR Status Promotion Platform"
                                    width={800}
                                    height={600}
                                    className="rounded-[18px] w-full h-auto object-cover"
                                    priority
                                />
                            </div>

                            {/* Background Glow for Image */}
                            <div className="absolute -inset-10 bg-[#1E73E8]/5 blur-3xl -z-10 rounded-full" />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
