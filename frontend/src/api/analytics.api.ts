import api from './api';

export const getDashboardSummary = async () => {
    const res = await api.get(`/dashboard/summary`);
    return res.data;
};

export const getAnalyticsOverview = async () => {
    const res = await api.get(`/analytics/overview`);
    return res.data;
};

export const getAnalyticsChart = async (days: number = 30) => {
    const res = await api.get(`/analytics/chart?days=${days}`);
    return res.data;
};

export const getAnalyticsPromotions = async (skip = 0, take = 10) => {
    const res = await api.get(`/analytics/promotions?skip=${skip}&take=${take}`);
    return res.data;
};

export const getTopPartners = async () => {
    const res = await api.get(`/analytics/partners`);
    return res.data;
};

export const getTopBanners = async () => {
    const res = await api.get(`/analytics/banners`);
    return res.data;
};

export const exportAnalyticsCsv = async () => {
    const res = await api.get(`/analytics/export`, {
        responseType: 'blob', // Important for downloading files
    });
    return res.data;
};
