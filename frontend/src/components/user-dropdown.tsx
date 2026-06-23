"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, BarChart3, Cog, LogOut, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    // Responsive: checking if mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close on click outside or escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setShowLogoutModal(false);
            }
        };

        if (isOpen || showLogoutModal) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, showLogoutModal]);

    const handleLogoutConfirm = () => {
        logout();
    };

    const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";
    const businessName = user?.business?.name || user?.firstName + " " + user?.lastName || "Business User";
    const businessCategory = user?.business?.category || "Registered Business";
    const email = user?.email || "user@example.com";

    const menuItems = [
        { icon: User, text: "View Profile", desc: "Manage business information", route: "/profile" },
        { icon: Settings, text: "Edit Profile", desc: "Update business details", route: "/profile-setup" },
        { icon: BarChart3, text: "Analytics", route: "/analytics" },
    ];

    const renderMenuContent = () => (
        <>
            {/* Header Section */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 text-brand-primary font-bold text-lg shadow-sm">
                    {userInitial}
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-[15px] font-semibold text-slate-800 truncate">{businessName}</h4>
                    <p className="text-[13px] text-slate-500 truncate">{businessCategory}</p>
                    <p className="text-[12px] text-slate-400 truncate mt-0.5">{email}</p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 flex flex-col gap-1">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.route}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg text-slate-600 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    >
                        <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                        <div className="flex flex-col group-hover:translate-x-1 transition-transform duration-200">
                            <span className="text-[14px] font-medium">{item.text}</span>
                            {item.desc && <span className="text-[11px] text-slate-400 group-hover:text-[#2563EB]/70">{item.desc}</span>}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="h-[1px] bg-slate-100 mx-2" />

            {/* Logout */}
            <div className="p-2">
                <button
                    onClick={() => {
                        setIsOpen(false);
                        setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                    <LogOut className="w-4 h-4 group-hover:text-red-600 transition-colors" />
                    <span className="text-[14px] font-medium group-hover:translate-x-1 transition-transform duration-200">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors border ${isOpen ? 'border-slate-300 bg-slate-50' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="h-8 w-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE] text-[#2563EB] font-bold shadow-sm">
                    {userInitial}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Dropdown */}
            {!isMobile && (
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 overflow-hidden z-[100]"
                        >
                            {renderMenuContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Mobile Bottom Sheet */}
            {isMobile && (
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/40 z-[90]"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[100] pb-safe"
                            >
                                <div className="p-4 flex justify-center border-b border-slate-100 relative">
                                    <div className="w-12 h-1.5 bg-slate-200 rounded-full absolute top-2" />
                                    <h3 className="text-sm font-semibold text-slate-800 mt-2">Account</h3>
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                                <div className="max-h-[70vh] overflow-y-auto">
                                    {renderMenuContent()}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            )}

            {/* Logout Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-[360px] p-6 overflow-hidden"
                        >
                            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Logout?</h3>
                            <p className="text-[14px] text-slate-500 mb-6">
                                Are you sure you want to logout from your account?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogoutConfirm}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold text-[14px] hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
