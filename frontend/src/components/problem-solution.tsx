"use client";

import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";

const problems = [
    {
        title: "Ads are expensive",
        description: "Paid advertising costs are rising, squeezing small business margins."
    },
    {
        title: "Organic reach is declining",
        description: "Social media algorithms limit free visibility for business pages."
    },
    {
        title: "Small businesses struggle with consistency",
        description: "Maintaining daily promotion requires time and resources most SMBs don't have."
    },
    {
        title: "Finding trusted partners is difficult",
        description: "Collaboration opportunities are scattered and lack a verification layer."
    }
];

const solutions = [
    "Promote another business",
    "Get promoted in return",
    "Track measurable engagement",
    "Build long-term partnerships"
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function ProblemSolution() {
    return (
        <section className="relative bg-[#F7FAFF] py-[120px] overflow-hidden">
            {/* Subtle background blob behind solution side */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[45%] h-[80%] bg-[#1E73E8]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-[30px] md:text-[34px] font-semibold text-[#111111] max-w-2xl mx-auto leading-tight">
                        Why Traditional Social Media Promotion Is Not Enough
                    </h2>
                </motion.div>

                {/* Two Column Grid */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">

                    {/* Vertical Divider */}
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-[1px] bg-[#1E73E8]/15 z-0" />

                    {/* LEFT — PROBLEM */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-[#F3F6FB] rounded-[18px] p-8 md:p-10 shadow-inner border border-slate-200/60 flex flex-col"
                    >
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">The Problem</span>

                        <motion.ul
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-7"
                        >
                            {problems.map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ x: -4, transition: { duration: 0.2 } }}
                                    className="flex items-start gap-4 group cursor-default"
                                >
                                    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[17px] font-semibold text-[#222]">{item.title}</p>
                                        <p className="text-[14px] text-[#666] mt-1 leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    {/* RIGHT — SOLUTION */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        animate={{ y: [0, -8, 0] }}
                        // @ts-ignore - framer-motion dual prop usage
                        style={{ animationDuration: "6s", animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }}
                        className="relative bg-white/80 backdrop-blur-sm rounded-[18px] p-8 md:p-10 shadow-xl border border-[#1E73E8]/15 ring-1 ring-[#1E73E8]/10 flex flex-col"
                    >
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1E73E8] mb-6">The Solution</span>

                        <h3 className="text-[20px] md:text-[22px] font-semibold text-[#111111] leading-snug mb-8">
                            A Smarter Way to Do Daily Business Promotion
                        </h3>

                        <p className="text-[15px] text-[#666] mb-6">Instead of spending thousands on ads:</p>

                        <motion.ul
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-5"
                        >
                            {solutions.map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    className="flex items-center gap-4"
                                >
                                    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#2FA7F5] to-[#1E73E8] flex items-center justify-center shadow-md">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-[16px] font-medium text-[#222]">{item}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </div>

                {/* Bottom Highlight Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-20 flex flex-col items-center gap-3"
                >
                    <p className="text-[20px] font-semibold text-[#1E73E8] text-center">
                        This is performance-driven barter marketing.
                    </p>
                    <div className="w-32 h-1 rounded-full bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8]" />
                </motion.div>

            </div>
        </section>
    );
}
