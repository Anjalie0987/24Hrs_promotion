import React from 'react';
import { Store, Briefcase, AlignLeft } from 'lucide-react';
import { BusinessData } from '@/api/business.api';
import { ValidationErrors } from '@/validation/businessValidation';
import { ValidationMessage } from '../common/ValidationMessage';

const categories = [
  "Retail", "Restaurant", "Education", "Real Estate", "Fashion",
  "Fitness", "Digital Services", "Coaching", "Startup", "Healthcare",
  "Beauty & Wellness", "Technology", "Automotive", "Entertainment",
  "Finance", "Legal", "Home Services", "Event Planning",
  "Travel & Tourism", "Logistics", "Photography", "Pet Services",
  "Other"
];

interface BusinessBasicInfoProps {
  formData: BusinessData;
  errors: ValidationErrors;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BusinessBasicInfo: React.FC<BusinessBasicInfoProps> = React.memo(({ formData, errors, disabled, onChange }) => {
  const inputClasses = "w-full h-12 px-11 rounded-xl border border-[#E5E7EB] text-[#111111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E73E8]/20 focus:border-[#1E73E8] transition-all bg-white placeholder-[#94A3B8]";
  const labelClasses = "block text-[14px] font-semibold text-[#111111] mb-2";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]";

  const isOther = formData.category === 'Other' || (formData.category !== '' && !categories.includes(formData.category));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClasses}>Business Name *</label>
          <div className="relative">
            <Store className={iconClasses} />
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter your business name"
              className={`${inputClasses} ${errors.name ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          <ValidationMessage error={errors.name} />
        </div>

        <div>
          <label className={labelClasses}>Owner Name *</label>
          <div className="relative">
            <Store className={iconClasses} />
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={onChange}
              placeholder="e.g. John Doe"
              className={`${inputClasses} ${errors.ownerName ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          <ValidationMessage error={errors.ownerName} />
        </div>

        <div>
          <label className={labelClasses}>Business Category *</label>
          <div className="relative">
            <Briefcase className={iconClasses} />
            <select
              name="category"
              value={isOther ? 'Other' : formData.category}
              onChange={onChange}
              className={`${inputClasses} appearance-none ${errors.category ? 'border-red-500' : ''}`}
              disabled={disabled}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {isOther && (
            <div className="mt-3 relative">
              <Briefcase className={iconClasses} />
              <input
                name="category"
                value={formData.category === 'Other' ? '' : formData.category}
                onChange={onChange}
                placeholder="Type your category here"
                className={`${inputClasses}`}
                disabled={disabled}
                autoFocus
              />
            </div>
          )}
          <ValidationMessage error={errors.category} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClasses}>Business Description</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-[#94A3B8]" />
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Tell us about your business..."
              className={`${inputClasses} h-32 py-3 pl-11 resize-none`}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
