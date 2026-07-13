import React from 'react';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { BusinessBasicInfo } from './BusinessBasicInfo';
import { BusinessContactInfo } from './BusinessContactInfo';
import { BusinessMediaUpload } from './BusinessMediaUpload';
import { BusinessPreview } from './BusinessPreview';
import { BusinessSuccess } from './BusinessSuccess';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { BusinessData } from '@/api/business.api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface BusinessFormProps {
  initialData?: BusinessData | null;
  isEditMode?: boolean;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ initialData, isEditMode = false }) => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  
  const {
    formData,
    logoFile,
    ownerPhotoFile,
    errors,
    loadingState,
    successData,
    steps,
    handleInputChange,
    handleFileChange,
    submitForm,
    resetForm,
  } = useBusinessForm(initialData, isEditMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm();
      await refreshUser();
    } catch (error) {
      // Errors are handled in the hook (like toast/logging)
    }
  };

  const isLoading = loadingState !== 'idle' && loadingState !== 'success';
  const logoPreviewUrl = logoFile ? URL.createObjectURL(logoFile) : formData.logoUrl || null;
  const ownerPhotoPreviewUrl = ownerPhotoFile ? URL.createObjectURL(ownerPhotoFile) : formData.ownerPhotoUrl || null;

  if (loadingState === 'success' && successData) {
    return (
      <BusinessSuccess 
        business={successData}
        onDashboardClick={() => router.push('/dashboard')}
        onEditClick={resetForm}
      />
    );
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} steps={steps} />
      
      <div className="max-w-4xl mx-auto">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-10 bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <BusinessMediaUpload 
              logoPreviewUrl={logoPreviewUrl}
              ownerPhotoPreviewUrl={ownerPhotoPreviewUrl}
              onLogoChange={(f) => handleFileChange(f, 'logo')}
              onOwnerPhotoChange={(f) => handleFileChange(f, 'ownerPhoto')}
              errors={errors}
              disabled={isLoading}
            />

            <BusinessBasicInfo 
              formData={formData}
              errors={errors}
              disabled={isLoading}
              onChange={handleInputChange}
            />

            <BusinessContactInfo 
              formData={formData}
              errors={errors}
              disabled={isLoading}
              onChange={handleInputChange}
            />

            <div className="pt-4 border-t border-[#F1F5F9]">
              <motion.button
                whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 20px 40px -10px rgba(30,115,232,0.3)" } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                type="submit"
                disabled={isLoading}
                className={`w-full h-[54px] bg-gradient-to-r from-[#2FA7F5] to-[#1E73E8] text-white font-bold text-lg rounded-[14px] shadow-xl shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEditMode ? "Updating..." : "Processing..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update Business Profile" : "Create Business Profile"}
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
