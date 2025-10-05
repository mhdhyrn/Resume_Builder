import { defineStore } from 'pinia';
import { adminLogin } from '@/services/api/admin.service';

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    isAdmin: sessionStorage.getItem('is_admin') === 'true',
    accessToken: sessionStorage.getItem('admin_access_token') || '',
  }),
  actions: {
    async login({ username, password }) {
      const response = await adminLogin({ username, password });
      if (response?.status === 200 && response?.data?.access_token) {
        this.accessToken = response.data.access_token;
        this.isAdmin = true;
        sessionStorage.setItem('access_token', this.accessToken);
        sessionStorage.setItem('is_admin', 'true');
      }
      return response;
    },
    logout() {
      this.isAdmin = false;
      this.accessToken = '';
      sessionStorage.removeItem('access_token');
      sessionStorage.setItem('is_admin', 'false');
    },
  },
  persist: true,
});
