import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface RequestCardProps {
  request: {
    id: string;
    status: string;
    createdAt: string;
    senderBusiness?: {
      name: string;
      logoUrl: string | null;
    };
    receiverBusiness?: {
      name: string;
      logoUrl: string | null;
    };
    banner: {
      imageUrl: string;
      title: string | null;
    };
  };
  type: 'incoming' | 'sent';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  isLoading
}) => {
  const isIncoming = type === 'incoming';
  const partner = isIncoming ? request.senderBusiness : request.receiverBusiness;
  
  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Banner Preview */}
        <div className="relative w-full md:w-32 aspect-[9/16] bg-slate-100">
          <Image
            src={request.banner.imageUrl}
            alt={request.banner.title || "Banner"}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold border ${statusColors[request.status as keyof typeof statusColors]}`}>
                {request.status}
              </span>
              <span className="text-[12px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.3 h-3.3" />
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {isIncoming ? 'From: ' : 'To: '} {partner?.name}
            </h3>
            <p className="text-sm text-slate-500 italic mb-4">
              Banner: {request.banner.title || 'Untitled Banner'}
            </p>
          </div>

          {isIncoming && request.status === 'PENDING' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAccept?.(request.id)}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => onReject?.(request.id)}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 text-slate-600 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
