import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Star, Building2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  req: any | null;
  type: "incoming" | "sent";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function RequestDrawer({ isOpen, onClose, req, type, onAccept, onReject, onCancel }: RequestDrawerProps) {
  if (!req) return null;

  const partner = type === "incoming" ? req.senderBusiness : req.receiverBusiness;
  const isPending = req.status === "PENDING";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full lg:w-[480px] bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#0F172A]">Request Details</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
              {/* Profile Overview */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden shrink-0 shadow-sm">
                  {partner?.logoUrl ? (
                    <Image src={partner.logoUrl} alt="Logo" fill className="object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] leading-tight mb-1">{partner?.name}</h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
                    <span className="uppercase tracking-wider">{partner?.category}</span>
                    {partner?.city && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{partner.city}</span>
                      </>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{partner?.trustScore || 50} Trust Score</span>
                  </div>
                </div>
              </div>

              {/* Banner Preview */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Banner to Promote
                </h4>
                <div className="w-[180px] aspect-[9/16] rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden shadow-inner mx-auto">
                  {req.banner?.watermarkedImageUrl && <Image src={req.banner.watermarkedImageUrl} alt="Banner" fill className="object-cover" />}
                </div>
              </div>

              {/* View Profile Link */}
              <Link 
                href={`/businesses?profile=${partner?.id}`} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">View Full Profile</h5>
                  <p className="text-xs text-slate-500">See history, insights, and metrics</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>

            {/* Sticky Actions */}
            <div className="p-6 border-t border-slate-100 bg-white">
              {type === "incoming" && isPending ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => { onReject?.(req.id); onClose(); }} 
                    className="flex-1 h-14 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => { onAccept?.(req.id); onClose(); }} 
                    className="flex-1 h-14 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/25 transition-all"
                  >
                    Approve Request
                  </button>
                </div>
              ) : type === "sent" && isPending ? (
                <button 
                  onClick={() => { onCancel?.(req.id); onClose(); }} 
                  className="w-full h-14 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                >
                  Cancel Request
                </button>
              ) : (
                <button 
                  onClick={onClose} 
                  className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
