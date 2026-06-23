import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface BusinessMetrics {
  completedPromotions: number;
  successRate: number;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  logoUrl?: string;
  bannerUrl?: string;
  trustScore: number;
  isVerified: boolean;
  isAvailable: boolean;
  metrics?: BusinessMetrics;
  requestStatus?: string | null;
  matchScore?: number;
  matchReason?: string;
}

interface DiscoveryFilters {
  search: string;
  category: string;
  city: string;
  state: string;
  minTrustScore: string;
  isVerified: boolean;
  hasWebsite: boolean;
  hasInstagram: boolean;
}

interface DiscoveryState {
  businesses: Business[];
  recommended: Business[];
  savedPartnerIds: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  filters: DiscoveryFilters;
  page: number;

  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  resetFilters: () => void;
  
  fetchBusinesses: (token: string, reset?: boolean) => Promise<void>;
  fetchRecommended: (token: string) => Promise<void>;
  fetchSavedPartners: (token: string) => Promise<void>;
  
  toggleSavePartner: (id: string, token: string) => Promise<void>;
}

const defaultFilters: DiscoveryFilters = {
  search: '',
  category: 'All',
  city: '',
  state: '',
  minTrustScore: '',
  isVerified: false,
  hasWebsite: false,
  hasInstagram: false,
};

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  businesses: [],
  recommended: [],
  savedPartnerIds: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  filters: defaultFilters,
  page: 0,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 0, // Reset to page 0 on filter change
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters, page: 0 });
  },

  fetchBusinesses: async (token: string, reset = false) => {
    const { filters, page, businesses } = get();
    const take = 12;
    const skip = reset ? 0 : page * take;

    if (reset) {
      set({ isLoading: true, page: 0 });
    } else {
      set({ isLoadingMore: true });
    }

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.minTrustScore) params.append('minTrustScore', filters.minTrustScore);
      if (filters.isVerified) params.append('isVerified', 'true');
      if (filters.hasWebsite) params.append('hasWebsite', 'true');
      if (filters.hasInstagram) params.append('hasInstagram', 'true');
      params.append('skip', skip.toString());
      params.append('take', take.toString());

      const res = await axios.get(`${API_URL}/business/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newBusinesses = res.data;
      
      set({
        businesses: reset ? newBusinesses : [...businesses, ...newBusinesses],
        hasMore: newBusinesses.length === take,
        page: reset ? 1 : page + 1,
        isLoading: false,
        isLoadingMore: false
      });
    } catch (error) {
      console.error('Failed to fetch businesses', error);
      set({ isLoading: false, isLoadingMore: false });
    }
  },

  fetchRecommended: async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/business/recommended`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ recommended: res.data });
    } catch (error) {
      console.error('Failed to fetch recommended', error);
    }
  },

  fetchSavedPartners: async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/business/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ savedPartnerIds: res.data.map((b: Business) => b.id) });
    } catch (error) {
      console.error('Failed to fetch saved partners', error);
    }
  },

  toggleSavePartner: async (id: string, token: string) => {
    const isSaved = get().savedPartnerIds.includes(id);
    
    // Optimistic update
    set((state) => ({
      savedPartnerIds: isSaved 
        ? state.savedPartnerIds.filter(savedId => savedId !== id)
        : [...state.savedPartnerIds, id]
    }));

    try {
      if (isSaved) {
        await axios.delete(`${API_URL}/business/${id}/save`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/business/${id}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Failed to toggle save', error);
      // Revert optimistic update on failure
      set((state) => ({
        savedPartnerIds: isSaved 
          ? [...state.savedPartnerIds, id]
          : state.savedPartnerIds.filter(savedId => savedId !== id)
      }));
    }
  }
}));
