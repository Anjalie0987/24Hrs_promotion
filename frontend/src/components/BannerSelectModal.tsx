import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, CheckCircle2, PlusCircle, Loader2 } from 'lucide-react';
import { getMyBanners } from '@/api/banner.api';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BannerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bannerId: string) => void;
  receiverName: string;
  isLoading?: boolean;
}

export const BannerSelectModal: React.FC<BannerSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  receiverName,
  isLoading: isSending
}) => {
  const [banners, setBanners] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchBanners();
    }
  }, [isOpen]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const data = await getMyBanners();
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select a Banner</h2>
            <p className="text-sm text-slate-500 font-medium">Sending promotion request to <span className="text-blue-600 font-bold">{receiverName}</span></p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-full transition-all text-slate-400 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Fetching your library...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-20 px-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No banners found</h3>
              <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">
                You need to have at least one active banner to start a promotion.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                <PlusCircle className="w-4 h-4" />
                Go to Upload Banner
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <motion.div
                  key={banner.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedId(banner.id)}
                  className={cn(
                    "relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-4",
                    selectedId === banner.id 
                      ? 'border-blue-600 shadow-2xl shadow-blue-500/20' 
                      : 'border-transparent hover:border-slate-200 grayscale-[0.5] hover:grayscale-0'
                  )}
                >
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                  />
                  {selectedId === banner.id && (
                    <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                      <div className="bg-blue-600 text-white rounded-full p-2 shadow-2xl scale-110">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 h-14 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => selectedId && onConfirm(selectedId)}
            disabled={!selectedId || isSending}
            className="flex-[2] h-14 bg-gradient-to-r from-blue-600 to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Send Promotion</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
