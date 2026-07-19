import { BusinessData } from '@/api/business.api';

export function buildBusinessFormData(
  data: BusinessData,
  logoFile: File | null,
  ownerPhotoFile: File | null
): FormData {
  const formData = new FormData();

  // Append files
  if (logoFile) {
    formData.append('logo', logoFile);
  }
  if (ownerPhotoFile) {
    formData.append('ownerPhoto', ownerPhotoFile);
  }

  // Append textual fields
  const fields: (keyof BusinessData)[] = [
    'name',
    'ownerName',
    'category',
    'description',
    'location',
    'website',
    'email',
    'whatsapp',
    'instagram',
    'yearsExperience',
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      formData.append(field, String(data[field]));
    }
  });

  return formData;
}
