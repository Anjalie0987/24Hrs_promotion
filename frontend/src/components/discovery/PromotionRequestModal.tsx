"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { Business, useDiscoveryStore } from "@/store/useDiscoveryStore";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface PromotionRequestModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromotionRequestModal({ business, isOpen, onClose }: PromotionRequestModalProps) {
  const { token } = useAuth();
  const [message, setMessage] = useState("Hi! I love your business and think we share a similar audience. Would you be open to a cross-promotion?");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchBusinesses } = useDiscoveryStore();

  if (!business) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      // In a real app, you'd also select a specific bannerId. 
      // We assume the backend selects the default active banner if not provided, 
      // or we send a generic request that gets hydrated later.
      await axios.post(`${API_URL}/requests/send`, {
        receiverBusinessId: business.id,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Promotion request sent successfully!');
      
      // Refresh to update requestStatus on cards
      fetchBusinesses(token, true);
      
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request. Do you have an active banner?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] overflow-hidden relative z-10"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Start Promotion</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 p-4 bg-[#F8FAFF] rounded-2xl border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
                  {business.logoUrl ? (
                    <img src={business.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[#1E73E8] uppercase mb-0.5">Requesting to</div>
                  <div className="text-[15px] font-bold text-slate-900">{business.name}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                  Personalized Message
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] resize-none"
                  placeholder="Say something nice..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#1E73E8] text-white font-bold text-[15px] shadow-sm hover:bg-[#2FA7F5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
