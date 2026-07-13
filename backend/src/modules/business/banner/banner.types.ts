export type BannerTemplateType =
  | 'corporate'
  | 'modern'
  | 'minimal'
  | 'festival';

export interface BannerData {
  name: string;
  ownerName?: string;
  category: string;
  description?: string;
  location?: string;
  whatsapp?: string;
  website?: string;
  yearsExperience?: number;
  logoUrl?: string;
  ownerPhotoUrl?: string;
}
