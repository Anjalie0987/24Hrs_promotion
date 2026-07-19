"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, User, Bell, LayoutDashboard, Megaphone, BarChart3, Trophy, ChevronDown, Home, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./mobile-drawer";
import { LucideIcon } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { UserDropdown } from "./user-dropdown";

interface NavItem {
    name: string;
    href: string;
    icon?: LucideIcon;
}

import { useAuth } from "@/context/auth-context";

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, isAuthenticated, loading } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const isDashboardPath = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/onboarding') ||
        pathname.startsWith('/promotion-requests') ||
        pathname.startsWith('/analytics') ||
        pathname.startsWith('/businesses') ||
        pathname.startsWith('/my-banners') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/settings');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const publicLinks: NavItem[] = [];

    const privateLinks: NavItem[] = [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Find Businesses", href: "/businesses" },
        { name: "Requests", href: "/promotion-requests" },
    ];

    // Show private UI if logged in OR on a dashboard path
    const showPrivateUI = isAuthenticated || isDashboardPath;
    const navigation = showPrivateUI ? privateLinks : publicLinks;

    const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    "h-[72px] flex items-center px-4 md:px-8 mx-auto",
                    "bg-white border-b border-slate-200 shadow-sm transition-colors",
                    isScrolled ? "opacity-100" : "opacity-95"
                )}
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between gap-4">
                        {/* LEFT: Logo Only */}
                        <Link
                            href="/"
                            className="flex items-center group shrink-0"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white"
                            >
                                <img
                                    src="/24HR_logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </Link>

                        {/* CENTER: Navigation Links */}
                        <div className="hidden md:flex items-center gap-10">
                            {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "text-[15px] font-medium transition-all duration-300 relative py-2 group flex items-center gap-2",
                                                    isActive ? "text-[#2563EB]" : "text-[#1E293B] hover:text-[#2563EB]"
                                                )}
                                            >
                                                {Icon && <Icon className="w-4 h-4" />}
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
                            {loading ? (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                            ) : !isAuthenticated ? (
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
                                    <NotificationBell />
                                    <div className="h-6 w-[1px] bg-slate-200/50 mx-1 hidden sm:block" />
                                        <UserDropdown />
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors border border-white/40"
                            >
                                <Menu className="h-6 w-6 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isLoggedIn={isAuthenticated}
                onLogout={handleLogout}
            />

            {/* Navbar Spacer is managed by layout padding-top */}
        </>
    );
}
