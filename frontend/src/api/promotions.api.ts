import api from './api';

export const getActivePromotions = async (skip = 0, take = 20) => {
  const response = await api.get(`/promotions/active?skip=${skip}&take=${take}`);
  return response.data;
};

export const getCompletedPromotions = async (skip = 0, take = 20) => {
  const response = await api.get(`/promotions/completed?skip=${skip}&take=${take}`);
  return response.data;
};

export const uploadPromotionProof = async (data: { promotionId: string; proofImageUrl: string }) => {
  const response = await api.post('/promotions/upload-proof', data);
  return response.data;
};
