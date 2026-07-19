import api from './api';

export interface BusinessData {
  id?: string;
  name: string;
  ownerName: string;
  category: string;
  description?: string;
  location?: string;
  instagram?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  yearsExperience?: number;
  logo?: string;
  logoUrl?: string;
  ownerPhotoUrl?: string;
  bannerUrl?: string;
}

export const createBusiness = async (data: FormData) => {
  const response = await api.post('/business/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// We keep this generic upload function if still needed elsewhere, otherwise it is unused by the new form flow.
export const uploadBusinessImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/business/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMyBusiness = async () => {
  const response = await api.get('/business/me');
  return response.data;
};

export const updateBusiness = async (data: FormData) => {
  const response = await api.put('/business/update', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getBusinessById = async (id: string) => {
  const response = await api.get(`/business/${id}`);
  return response.data;
};

export const getBusinesses = async (params: { search?: string; category?: string; location?: string } = {}) => {
  const response = await api.get('/business', { params });
  return response.data;
};

export const getRecommendedBusinesses = async () => {
  const response = await api.get('/business/recommended');
  return response.data;
};
