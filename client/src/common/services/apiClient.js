import api from '../utils/api';

/**
 * Industrial-grade API Service Layer
 * Maps raw backend network endpoints exclusively so React components don't hold messy hardcoded URLs.
 */

export const DashboardAPI = {
  getUsers: async (page, limit, search) => {
    const res = await api.get(`/users?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
  }
};

export const KycAPI = {
  uploadBiometrics: async (formData) => {
    const res = await api.post('/kyc/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  
  getKycStatus: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};
