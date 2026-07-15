import { BusinessData } from '@/api/business.api';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateBusinessForm(data: BusinessData, logoFile: File | null, ownerPhotoFile: File | null, isEditMode: boolean): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Business Name is required';
  }

  if (data.description && data.description.length > 250) {
    errors.description = 'Description cannot exceed 250 characters';
  }

  if (!data.ownerName || data.ownerName.trim() === '') {
    errors.ownerName = 'Owner Name is required';
  }

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Business Category is required';
  }

  if (!isEditMode && !logoFile && !data.logoUrl) {
    errors.logo = 'Business Logo is required';
  }

  if (!isEditMode && !ownerPhotoFile && !data.ownerPhotoUrl) {
    errors.ownerPhoto = 'Owner Photo is required';
  }

  if (data.whatsapp) {
    // Basic phone validation for international format or 10 digits
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.whatsapp.replace(/[\s-]/g, ''))) {
      errors.whatsapp = 'Invalid WhatsApp format';
    }
  }

  if (data.website) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(data.website)) {
      errors.website = 'Invalid website URL';
    }
  }

  if (data.yearsExperience) {
    const exp = Number(data.yearsExperience);
    if (!Number.isInteger(exp) || exp < 0) {
      errors.yearsExperience = 'Years of experience must be a positive integer';
    }
  }

  return errors;
}
