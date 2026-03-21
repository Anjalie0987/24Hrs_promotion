"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Briefcase } from "lucide-react";
import { getMyBusiness } from "@/api/business.api";
import BusinessForm from "@/components/BusinessForm";
import ProtectedRoute from "@/components/protected-route";

export default function ProfileSetup() {
    const [isLoading, setIsLoading] = useState(true);
    const [business, setBusiness] = useState<any>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await getMyBusiness();
                setBusiness(data);
            } catch (error) {
                console.log("No business found or error fetching business");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusiness();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
                <Loader2 className="w-10 h-10 text-[#1E73E8] animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFF] py-12 px-4 md:px-8">
                <div className="max-w-[800px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[32px] font-bold text-[#111111] mb-2"
                        >
                            {business ? "Update Your Business Profile" : "Create Your Business Profile"}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[#555555] text-[16px]"
                        >
                            {business 
                                ? "Keep your business details up to date for better reach." 
                                : "Add your business details to start promoting and getting featured."}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[20px] p-8 md:p-10 shadow-xl shadow-blue-900/5"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-lg bg-[#1E73E8]/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-[#1E73E8]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#111111]">Business Information</h2>
                        </div>

                        <BusinessForm initialData={business} isEditMode={!!business} />
                    </motion.div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
