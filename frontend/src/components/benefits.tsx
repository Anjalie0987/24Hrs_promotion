"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
    DollarSign,
    Eye,
    Handshake,
    BarChart3,
    ShieldCheck,
    TrendingUp
} from "lucide-react";
import { useRef, MouseEvent } from "react";

const benefits = [
    {
        icon: DollarSign,
        title: "Cost-Effective Marketing",
        description: "Grow without spending thousands on ads.",
        featured: false
    },
    {
        icon: Eye,
        title: "Daily Visibility",
        description: "Stay in front of customers every single day.",
        featured: false
    },
    {
        icon: Handshake,
        title: "Structured Cross-Promotion",
        description: "Promotions built on mutual approval & fairness.",
        featured: false
    },
    {
        icon: BarChart3,
        title: "Measurable Results",
        description: "Track clicks, QR scans, and real engagement.",
        featured: true
    },
    {
        icon: ShieldCheck,
        title: "Verified Business Network",
        description: "Connect with trusted and active businesses.",
        featured: false
    },
    {
        icon: TrendingUp,
        title: "Scalable Growth Model",
        description: "Expand across cities without increasing ad budgets.",
        featured: false
    }
];

function BenefitCard({ icon: Icon, title, description, featured, index }: {
    icon: React.ElementType;
    title: string;
    description: string;
    featured: boolean;
    index: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring configuration for the tilt
    const stiffness = 150;
    const damping = 20;

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness, damping });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness, damping });
    const scale = useSpring(1, { stiffness, damping });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
        scale.set(1.02);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            className="h-full"
        >
            <div
                className={`relative group rounded-[20px] p-[26px] h-full transition-colors duration-300 overflow-hidden
          ${featured
                        ? "bg-gradient-to-br from-[#1E73E8] to-[#0F5FCC] text-white shadow-xl hover:shadow-blue-500/40"
                        : "bg-white border border-[#E6F0FF] text-[#111111] shadow-sm hover:shadow-2xl hover:shadow-blue-200/50 hover:bg-gradient-to-br hover:from-[#F0F6FF] hover:to-[#E6F1FF]"
                    }`}
            >
                {/* Top Highlight Glow (Hover) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon Container with its own 3D transform to pop */}
                <div
                    style={{ transform: "translateZ(20px)" }}
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300
                    ${featured
                            ? "bg-white/20 group-hover:bg-white/30"
                            : "bg-[#1E73E8]/10 group-hover:bg-[#1E73E8]/20"
                        }`}
                >
                    <Icon className={`w-5 h-5 ${featured ? "text-white" : "text-[#1E73E8]"}`} />
                </div>

                <div style={{ transform: "translateZ(10px)" }}>
                    <h3 className={`text-[18px] font-bold mb-2 transition-colors duration-300 ${featured ? "text-white" : "text-[#111111]"}`}>
                        {title}
                    </h3>
                    <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${featured ? "text-white/80" : "text-[#555555]"}`}>
                        {description}
                    </p>
                </div>

                {/* Decorative elements for featured card */}
                {featured && (
                    <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-white/5 blur-3xl rounded-full pointer-events-none" />
                )}
            </div>
        </motion.div>
    );
}

export function Benefits() {
    return (
        <section className="relative bg-[#F4F8FF] py-[120px] overflow-hidden">
            {/* Background Gradient Depth */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-[#1E73E8]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 max-w-7xl mx-auto">

                    {/* LEFT — Intro Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-[420px] shrink-0 lg:pt-4"
                    >
                        <h2 className="text-[34px] md:text-[36px] font-semibold text-[#111111] leading-[1.2] mb-6">
                            Why Choose 24HR Status Promotion?
                        </h2>
                        <p className="text-[16px] text-[#555555] leading-relaxed">
                            Built to help businesses grow consistently through structured, measurable cross-promotion.
                        </p>
                    </motion.div>

                    {/* RIGHT — 3×2 Card Grid */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
                        {benefits.map((benefit, index) => (
                            <BenefitCard key={benefit.title} {...benefit} index={index} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
