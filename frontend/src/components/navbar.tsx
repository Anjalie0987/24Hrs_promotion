"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, Bell, LayoutDashboard, Megaphone, BarChart3, Trophy, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./mobile-drawer";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const publicLinks = [
        { name: "Home", href: "/" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
    ];

    const privateLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Promotions", href: "/promotions", icon: Megaphone },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    ];

    const navigation = isLoggedIn ? privateLinks : publicLinks;

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    "h-[72px] flex items-center px-4 md:px-8 mx-auto",
                    "bg-white/70 backdrop-blur-md border-b border-white/40 shadow-lg rounded-b-2xl",
                    isScrolled ? "translate-y-0 opacity-100" : "translate-y-0"
                )}
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between gap-4">
                        {/* LEFT: Logo Only */}
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/"}
                            className="flex items-center group shrink-0"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white"
                            >
                                <img
                                    src="/24HR_logo.jpg"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </Link>

                        {/* CENTER: Navigation Links */}
                        <div className="hidden md:flex items-center gap-10">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "text-[15px] font-medium transition-all duration-300 relative py-2 group",
                                            isActive ? "text-[#2563EB]" : "text-[#1E293B] hover:text-[#2563EB]"
                                        )}
                                    >
                                        {item.name}

                                        {/* Underline Animation */}
                                        <span
                                            className={cn(
                                                "absolute bottom-0 left-0 h-[2px] bg-[#2563EB] transition-all duration-300 ease-out",
                                                isActive ? "w-full" : "w-0 group-hover:w-full"
                                            )}
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* RIGHT: Auth & Tools */}
                        <div className="flex items-center gap-4 md:gap-6">
                            {!isLoggedIn ? (
                                <div className="hidden md:flex items-center gap-8">
                                    <Link
                                        href="/login"
                                        className="text-[15px] font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <motion.div
                                        whileHover={{ y: -2, boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="rounded-xl overflow-hidden"
                                    >
                                        <Link
                                            href="/register"
                                            className="px-6 py-2.5 rounded-xl btn-gradient text-sm font-semibold shadow-md hover:shadow-xl transition-all inline-block border border-white/20"
                                        >
                                            Sign Up
                                        </Link>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button className="p-2 rounded-full hover:bg-white/50 text-slate-600 transition-colors relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white/70" />
                                    </button>
                                    <div className="h-6 w-[1px] bg-slate-200/50 mx-1 hidden sm:block" />
                                    <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/50 transition-colors border border-white/40">
                                        <div className="h-8 w-8 rounded-lg bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 text-brand-primary font-bold shadow-sm">
                                            A
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors border border-white/40"
                            >
                                <Menu className="h-6 w-6 text-slate-600" />
                            </button>

                            {/* DEMO TOOL */}
                            <button
                                onClick={() => setIsLoggedIn(!isLoggedIn)}
                                className="text-[9px] text-slate-400 hover:text-[#2563EB] transition-colors border border-dashed border-slate-200 px-1.5 py-0.5 rounded-md"
                            >
                                {isLoggedIn ? 'LOGOUT' : 'LOGIN'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            {/* Navbar Spacer is managed by layout padding-top */}
        </>
    );
}
