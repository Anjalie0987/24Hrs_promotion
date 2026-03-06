"use client";

import Link from "next/link";
import { X, LayoutDashboard, Megaphone, BarChart3, Trophy, Home, Info, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
}

export function MobileDrawer({ isOpen, onClose, isLoggedIn }: MobileDrawerProps) {
    const publicLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "How It Works", href: "#how-it-works", icon: Info },
        { name: "Pricing", href: "#pricing", icon: Tag },
    ];

    const privateLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Promotions", href: "/promotions", icon: Megaphone },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    ];

    const navigation = isLoggedIn ? privateLinks : publicLinks;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 z-[70] h-full w-[280px] bg-white/90 backdrop-blur-lg border-l border-white/40 p-6 shadow-2xl md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-10">
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="block shrink-0"
                                >
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/40 shadow-sm flex items-center justify-center bg-white">
                                        <img
                                            src="/24HR_logo.jpg"
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white transition-colors border border-white/40"
                                >
                                    <X className="h-6 w-6 text-slate-600" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-all font-medium"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto space-y-4 pt-8 border-t border-[#E2E8F0]">
                                {!isLoggedIn ? (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="block w-full text-center py-3 rounded-xl font-medium text-slate-600 border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={onClose}
                                            className="block w-full text-center py-3 rounded-xl font-medium btn-gradient shadow-md"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {/* Mock logout */ }}
                                        className="w-full py-3 rounded-xl font-medium text-error hover:bg-error/5 transition-colors border border-dashed border-error/20"
                                    >
                                        Log Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
