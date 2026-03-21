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

export const getIncomingRequests = async () => {
  const response = await api.get('/requests/incoming');
  return response.data;
};

export const getSentRequests = async () => {
  const response = await api.get('/requests/sent');
  return response.data;
};
