import React from 'react';
import { ImageUploader } from '../common/ImageUploader';
import { ValidationErrors } from '@/validation/businessValidation';

interface BusinessMediaUploadProps {
  logoPreviewUrl: string | null;
  ownerPhotoPreviewUrl: string | null;
  onLogoChange: (file: File | null) => void;
  onOwnerPhotoChange: (file: File | null) => void;
  errors: ValidationErrors;
  disabled: boolean;
}

export const BusinessMediaUpload: React.FC<BusinessMediaUploadProps> = React.memo(({
  logoPreviewUrl,
  ownerPhotoPreviewUrl,
  onLogoChange,
  onOwnerPhotoChange,
  errors,
  disabled
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Business Media</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        <ImageUploader
          id="logo-upload"
          title="Business Logo *"
          description="Square image recommended"
          previewUrl={logoPreviewUrl}
          onChange={onLogoChange}
          error={errors.logo}
          disabled={disabled}
        />

        <ImageUploader
          id="owner-photo-upload"
          title="Owner Photo *"
          description="Clear face portrait"
          previewUrl={ownerPhotoPreviewUrl}
          onChange={onOwnerPhotoChange}
          error={errors.ownerPhoto}
          disabled={disabled}
        />
      </div>
    </div>
  );
});
