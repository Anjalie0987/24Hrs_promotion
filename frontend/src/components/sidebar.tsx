"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Store,
    Megaphone,
    Image as ImageIcon,
    BarChart3,
    Settings,
    X,
    Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Businesses", href: "/businesses", icon: Store },
    { name: "Promotions", href: "/promotions", icon: Megaphone },
    { name: "Banners", href: "/banners", icon: ImageIcon },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-[55] h-full w-64 bg-card border-r border-border-subtle transition-transform duration-300 ease-in-out md:translate-x-0 md:pt-20",
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 md:hidden">
                    <span className="text-xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                        24H Status
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        <X className="h-6 w-6 text-foreground" />
                    </button>
                </div>

                <div className="px-4 py-6">
                    <div className="mb-4 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Menu
                    </div>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    className={cn(
                                        "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-brand-primary/10 text-brand-primary shadow-sm"
                                            : "text-text-secondary hover:bg-accent hover:text-brand-primary"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                            isActive ? "text-brand-primary" : "text-text-muted group-hover:text-brand-primary"
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-8 left-0 w-full px-6">
                    <div className="p-4 rounded-xl bg-brand-gradient text-white shadow-lg overflow-hidden relative">
                        <div className="relative z-10 text-sm font-semibold mb-1">Upgrade to Pro</div>
                        <div className="relative z-10 text-xs text-white/80">Get advanced analytics & more</div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                    </div>
                </div>
            </aside>
        </>
    );
}
