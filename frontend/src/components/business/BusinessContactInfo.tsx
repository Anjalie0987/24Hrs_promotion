import React from 'react';
import { MapPin, Phone, Instagram, Globe, Star } from 'lucide-react';
import { BusinessData } from '@/api/business.api';
import { ValidationErrors } from '@/validation/businessValidation';
import { ValidationMessage } from '../common/ValidationMessage';

interface BusinessContactInfoProps {
  formData: BusinessData;
  errors: ValidationErrors;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BusinessContactInfo: React.FC<BusinessContactInfoProps> = React.memo(({ formData, errors, disabled, onChange }) => {
  const inputClasses = "w-full h-12 px-11 rounded-xl border border-[#E5E7EB] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
  const labelClasses = "block text-[14px] font-semibold text-[#111111] mb-2";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]";

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Contact & Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Location</label>
          <div className="relative">
            <MapPin className={iconClasses} />
            <input
              name="location"
              value={formData.location}
              onChange={onChange}
              placeholder="e.g. Mumbai, India"
              className={inputClasses}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>WhatsApp Number</label>
          <div className="relative">
            <Phone className={iconClasses} />
            <input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={onChange}
              placeholder="e.g. +91 9876543210"
              className={`${inputClasses} ${errors.whatsapp ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          <ValidationMessage error={errors.whatsapp} />
        </div>

        <div>
          <label className={labelClasses}>Instagram Username</label>
          <div className="relative">
            <Instagram className={iconClasses} />
            <input
              name="instagram"
              value={formData.instagram}
              onChange={onChange}
              placeholder="e.g. @business_handle"
              className={inputClasses}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Website</label>
          <div className="relative">
            <Globe className={iconClasses} />
            <input
              name="website"
              value={formData.website}
              onChange={onChange}
              placeholder="e.g. https://mybusiness.com"
              className={`${inputClasses} ${errors.website ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          <ValidationMessage error={errors.website} />
        </div>

        <div>
          <label className={labelClasses}>Years of Experience</label>
          <div className="relative">
            <Star className={iconClasses} />
            <input
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience || ''}
              onChange={onChange}
              placeholder="e.g. 5"
              min="0"
              className={`${inputClasses} ${errors.yearsExperience ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          <ValidationMessage error={errors.yearsExperience} />
        </div>
      </div>
    </div>
  );
});
