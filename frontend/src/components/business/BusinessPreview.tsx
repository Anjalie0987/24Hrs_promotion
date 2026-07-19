import React from 'react';
import Image from 'next/image';
import { BusinessData } from '@/api/business.api';

interface BusinessPreviewProps {
  formData: BusinessData;
  logoPreviewUrl: string | null;
  ownerPhotoPreviewUrl: string | null;
}

export const BusinessPreview: React.FC<BusinessPreviewProps> = React.memo(({
  formData,
  logoPreviewUrl,
  ownerPhotoPreviewUrl
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full sticky top-8">
      <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] h-32 relative">
        {ownerPhotoPreviewUrl && (
          <div className="absolute right-6 top-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <Image src={ownerPhotoPreviewUrl} alt="Owner Preview" fill className="object-cover" />
          </div>
        )}
      </div>
      
      <div className="px-6 pb-6 relative flex-grow">
        <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-lg -mt-12 mb-4 bg-white relative">
          {logoPreviewUrl ? (
            <Image src={logoPreviewUrl} alt="Logo Preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-2">
              Logo Here
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 break-words">
          {formData.name || 'Your Business Name'}
        </h2>
        <p className="text-blue-600 font-medium mb-4">
          {formData.category || 'Category'}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          {formData.location && <p>📍 {formData.location}</p>}
          {formData.whatsapp && <p>💬 {formData.whatsapp}</p>}
          {formData.email && <p>✉️ {formData.email}</p>}
          {formData.website && <p>🌐 {formData.website}</p>}
        </div>
      </div>
    </div>
  );
});
