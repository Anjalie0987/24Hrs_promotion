import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadPromotionProof as uploadProof } from '@/api/promotions.api';
import { toast } from 'react-hot-toast';

interface PromotionCardProps {
  promotion: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    senderProof: string | null;
    receiverProof: string | null;
    request: {
      senderBusiness: { id: string; name: string; logoUrl: string | null };
      receiverBusiness: { id: string; name: string; logoUrl: string | null };
      banner: { imageUrl: string; title: string | null };
    };
  };
  currentBusinessId: string;
  onUpdate?: () => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ 
  promotion, 
  currentBusinessId,
  onUpdate 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const isSender = promotion.request.senderBusiness.id === currentBusinessId;
  const partner = isSender ? promotion.request.receiverBusiness : promotion.request.senderBusiness;
  const myProof = isSender ? promotion.senderProof : promotion.receiverProof;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(promotion.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion.endTime]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;
    
    try {
      setIsUploading(true);
      // In a real app, you'd upload the file to S3/Cloudinary first.
      // Here we simulate using the base64 preview for simplicity as requested "proofImageUrl".
      await uploadProof({
        promotionId: promotion.id,
        proofImageUrl: preview
      });
      toast.success('Proof uploaded successfully!');
      setPreview(null);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to upload proof');
    } finally {
      setIsUploading(false);
    }
  };

  const statusColors = {
    ACTIVE: 'bg-blue-100 text-blue-700 border-blue-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    EXPIRED: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Banner Preview */}
        <div className="relative w-full md:w-48 aspect-[9/16] bg-slate-100">
          <Image
            src={promotion.request.banner.imageUrl}
            alt={promotion.request.banner.title || "Banner"}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[promotion.status as keyof typeof statusColors]}`}>
              {promotion.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-400">{partner.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner</p>
                  <h4 className="font-bold text-slate-900">{partner.name}</h4>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                <div className="flex items-center gap-2 text-blue-600 font-black text-lg">
                  <Clock className="w-5 h-5" />
                  {timeLeft}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">My Status</p>
                {myProof ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Proof Uploaded
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Pending Proof
                  </div>
                )}
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Partner Status</p>
                {(isSender ? promotion.receiverProof : promotion.senderProof) ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    In Progress
                  </div>
                )}
              </div>
            </div>
          </div>

          {!myProof && promotion.status === 'ACTIVE' && (
            <div className="space-y-4">
              {preview ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-blue-600">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={() => setPreview(null)}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                  <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Click to upload proof image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}

              <button
                disabled={!preview || isUploading}
                onClick={handleUpload}
                className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:opacity-50 disabled:bg-slate-200 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm & Submit Proof
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
