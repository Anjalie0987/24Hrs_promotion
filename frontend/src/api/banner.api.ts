import api from './api';

export const uploadBanner = async (data: { imageUrl: string; title?: string }) => {
  const response = await api.post('/banners/upload', data);
  return response.data;
};

export const getMyBanners = async () => {
  const response = await api.get('/banners/my-banners');
  return response.data;
};

export const deleteBanner = async (id: string) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};
