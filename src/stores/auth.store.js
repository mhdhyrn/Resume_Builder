import authService from '@/services/api/auth.service';
import { verifyUserMapper, verifyOtpMapper } from '@/mappers/auth/auth.mapper';
import { ref } from 'vue';
import personalInfoService from '@/services/api/personal-info.service';
import { profileInfoMapper } from '@/mappers/personal-info/personal-info.mapper';

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
      async updateProfile(data) {
        const formData = profileInfoMapper(data);
        const response = await personalInfoService.updateProfileInfo(formData);
        if (response.status === 200) {
          userInfo.value = {
            ...userInfo.value,
            ...data,
          };
        }
        return response;
      },
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
