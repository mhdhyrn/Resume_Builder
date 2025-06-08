import authService from '@/services/api/auth.service';
import { verifyUserMapper, verifyOtpMapper } from '@/mappers/auth/auth.mapper';
import { ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userInfo = ref({
      phoneNumber: '123',
    });

    const verifyUser = async ({ phoneNumber }) => {
      const payload = verifyUserMapper(phoneNumber);
      const response = await authService.verifyUser(payload);
      userInfo.value.phoneNumber = phoneNumber;
      return response;
    };

    const verifyOtp = async ({ phoneNumber, otp }) => {
      const payload = verifyOtpMapper(phoneNumber, otp);
      const response = await authService.verifyOtp(payload);
      if (response.status == 200)
        sessionStorage.setItem('access_token', response.data.access_token);
      return response;
    };

    return {
      verifyUser,
      verifyOtp,
      userInfo,
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: ['userInfo'],
    },
  },
);

export default useAuthStore;
