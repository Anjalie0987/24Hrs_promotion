"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Determine if we should show the dashboard layout (with sidebar)
    // For now, let's assume all authenticated paths show the sidebar
    // In a real app, this would be based on auth state + path
    const isDashboardPath = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/promotions') ||
        pathname.startsWith('/analytics') ||
        pathname.startsWith('/businesses') ||
        pathname.startsWith('/banners') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/settings');

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                {isDashboardPath && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}

                <main className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    isDashboardPath ? "md:pl-64" : ""
                )}>
                    <div className="container mx-auto p-4 md:p-8 pt-[152px] max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Toggle - Only visible on dashboard paths when sidebar is needed */}
            {isDashboardPath && !isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed bottom-6 right-6 z-40 p-3 rounded-full btn-gradient shadow-lg md:hidden"
                >
                    <LayoutDashboard className="h-6 w-6 text-white" />
                </button>
            )}
        </div>
    );
}

// Helper for the mobile toggle icon
import { LayoutDashboard } from "lucide-react";
