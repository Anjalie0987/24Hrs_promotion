import api from './api';

export const sendRequest = async (data: { receiverBusinessId: string; bannerId: string }) => {
  const response = await api.post('/requests/send', data);
  return response.data;
};

export const acceptRequest = async (id: string) => {
  const response = await api.post(`/requests/accept/${id}`);
  return response.data;
};

export const rejectRequest = async (id: string) => {
  const response = await api.post(`/requests/reject/${id}`);
  return response.data;
};

export const cancelRequest = async (id: string) => {
  const response = await api.delete(`/requests/cancel/${id}`);
  return response.data;
};

export const getIncomingRequests = async (skip = 0, take = 20) => {
  const response = await api.get(`/requests/incoming?skip=${skip}&take=${take}`);
  return response.data;
};

export const getSentRequests = async (skip = 0, take = 20) => {
  const response = await api.get(`/requests/sent?skip=${skip}&take=${take}`);
  return response.data;
};
