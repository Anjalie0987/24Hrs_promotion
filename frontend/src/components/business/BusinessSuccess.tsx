import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Edit, LayoutDashboard, Loader2 } from 'lucide-react';
import { BusinessData } from '@/api/business.api';
import { downloadBannerImage } from '@/utils/downloadBanner';

interface BusinessSuccessProps {
  business: BusinessData;
  onDashboardClick: () => void;
  onEditClick: () => void;
}

export const BusinessSuccess: React.FC<BusinessSuccessProps> = ({
  business,
  onDashboardClick,
  onEditClick,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!business.bannerUrl) {
      alert('Banner is not available for download.');
      return;
    }
    
    try {
      setIsDownloading(true);
      await downloadBannerImage(business.bannerUrl, business.name);
    } catch (error) {
      alert('Banner is not available for download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100"
    >
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Created Successfully!</h1>
        <h2 className="text-xl font-semibold text-green-600 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Banner Generated Successfully
        </h2>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-10">
        {business.bannerUrl && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-200">
            <Image src={business.bannerUrl} alt="Generated Banner" fill className="object-contain bg-gray-100" />
          </div>
        )}
        
        <div className="flex items-center gap-6">
          {business.logoUrl && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md border-2 border-white">
              <Image src={business.logoUrl} alt="Logo" fill className="object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{business.name}</h3>
            <p className="text-blue-600 font-medium">{business.category}</p>
            {business.whatsapp && <p className="text-gray-600 text-sm mt-1">📞 {business.whatsapp}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onDashboardClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <LayoutDashboard className="w-6 h-6 mb-2" />
          <span className="font-semibold">Go to Dashboard</span>
        </button>
        
        <button
          onClick={onEditClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Edit className="w-6 h-6 mb-2" />
          <span className="font-semibold">Edit Business</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 text-purple-700 transition-colors ${
            isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-100'
          }`}
        >
          {isDownloading ? (
            <Loader2 className="w-6 h-6 mb-2 animate-spin" />
          ) : (
            <Download className="w-6 h-6 mb-2" />
          )}
          <span className="font-semibold">
            {isDownloading ? 'Downloading...' : 'Download Banner'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};
