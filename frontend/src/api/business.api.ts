import api from './api';

export interface BusinessData {
  id?: string;
  name: string;
  category: string;
  description?: string;
  location?: string;
  instagram?: string;
  whatsapp?: string;
  logo?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export const createBusiness = async (data: BusinessData) => {
  const response = await api.post('/business/create', data);
  return response.data;
};

export const getMyBusiness = async () => {
  const response = await api.get('/business/me');
  return response.data;
};

export const updateBusiness = async (data: Partial<BusinessData>) => {
  const response = await api.put('/business/update', data);
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
