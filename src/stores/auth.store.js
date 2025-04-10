import authService from '@/services/api/auth.service';
import { reactive, ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(sessionStorage.getItem('access-token') || '');
    const userInfo = reactive({
      phoneNumber: sessionStorage.getItem('userInfo.phoneNumber') || '',
    });

    const verifyUser = async ({ phoneNumber, password }) => {
      const payload = { phone_number: phoneNumber, password };
      const { data } = await authService.login(payload);
      sessionStorage.setItem('access-token', data?.token);
    };

    return { verifyUser, userInfo };
  },
  {
    persist: {
      path: ['access-token', 'userInfo'],
      storage: sessionStorage,
    },
  },
);

export default useAuthStore;
