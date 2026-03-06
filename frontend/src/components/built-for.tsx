"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Store,
    Rocket,
    UserCheck,
    ShoppingBag,
    Briefcase,
    Building2
} from "lucide-react";

const leftCards = [
    {
        icon: Store,
        title: "Local Shops",
        description: "Retail stores, salons, cafes, and neighborhood businesses."
    },
    {
        icon: Rocket,
        title: "Startups",
        description: "Early-stage ventures looking for cost-effective growth."
    },
    {
        icon: UserCheck,
        title: "Coaches & Consultants",
        description: "Professionals building authority through social visibility."
    }
];

const rightCards = [
    {
        icon: ShoppingBag,
        title: "D2C Brands",
        description: "Direct-to-consumer brands scaling through status marketing."
    },
    {
        icon: Briefcase,
        title: "Service Providers",
        description: "Agencies, freelancers, and local service businesses."
    },
    {
        icon: Building2,
        title: "Real Estate & Education",
        description: "Real estate agents and educational institutes expanding reach."
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1 }
    })
};

function FeatureCard({ icon: Icon, title, description, index }: {
    icon: React.ElementType;
    title: string;
    description: string;
    index: number;
}) {
    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(30,115,232,0.15)", borderColor: "rgba(30,115,232,0.25)" }}
            viewport={{ once: true }}
            className="bg-[#F6F9FF] rounded-[18px] p-6 border border-transparent shadow-sm 
                 transition-all duration-300 cursor-default flex items-start gap-4"
        >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1E73E8]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#1E73E8]" />
            </div>
            <div>
                <h3 className="text-[17px] font-semibold text-[#111111] mb-1">{title}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

export function BuiltFor() {
    return (
        <section className="bg-white py-[120px] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-[30px] md:text-[36px] font-semibold text-[#111111] mb-4">
                        Built for Growing Businesses
                    </h2>
                    <p className="text-[16px] text-[#555555] max-w-xl mx-auto leading-relaxed">
                        If you use WhatsApp or Instagram stories for marketing, this platform is for you.
                    </p>
                </motion.div>

                {/* Main 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center max-w-6xl mx-auto">

                    {/* LEFT CARDS */}
                    <div className="flex flex-col gap-5">
                        {leftCards.map((card, i) => (
                            <FeatureCard key={card.title} {...card} index={i} />
                        ))}
                    </div>

                    {/* CENTER IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-shrink-0 mx-auto md:mx-6 lg:mx-10"
                    >
                        <motion.div
                            animate={{ y: [0, -14, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            {/* Glow behind image */}
                            <div className="absolute inset-0 bg-[#1E73E8]/10 blur-3xl rounded-full scale-125 -z-10" />
                            <div className="rounded-[20px] overflow-hidden shadow-2xl border border-slate-100 w-[220px] md:w-[260px] lg:w-[300px]">
                                <Image
                                    src="/Hero.png"
                                    alt="Business owner using 24HR Status Promotion"
                                    width={300}
                                    height={360}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT CARDS */}
                    <div className="flex flex-col gap-5">
                        {rightCards.map((card, i) => (
                            <FeatureCard key={card.title} {...card} index={i + 3} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
