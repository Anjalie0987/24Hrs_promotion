import api from './api';

export const getActivePromotions = async () => {
  const response = await api.get('/promotions/active');
  return response.data;
};

export const getAllPromotions = async () => {
  const response = await api.get('/promotions/all');
  return response.data;
};

export const uploadProof = async (data: { promotionId: string; proofImageUrl: string }) => {
  const response = await api.post('/promotions/upload-proof', data);
  return response.data;
};
