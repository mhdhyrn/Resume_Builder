import { defineStore } from 'pinia';
import { ref } from 'vue';
import personalInfoService from '@/services/api/personal-info.service';
import {
  personalInfoMapper,
  contactInfoMapper,
  profileInfoMapper,
} from '@/mappers/personal-info/personal-info.mapper';

export const usePersonalInfoStore = defineStore('personalInfo', () => {
  const personalInfo = ref({
    gender: '',
    isMarried: false,
    militaryServiceStatus: '',
    aboutMe: '',
  });

  const contactInfo = ref({
    phoneNumber: '',
    email: '',
    landline: '',
    website: '',
    country: '',
    province: '',
    city: '',
    address: '',
  });

  const profileInfo = ref({
    firstName: '',
    lastName: '',
    birthDate: '',
    profilePicture: null,
  });

  const updatePersonalInfo = async (data) => {
    const payload = personalInfoMapper(data);
    const response = await personalInfoService.updatePersonalInfo(payload);
    if (response.status === 200) {
      personalInfo.value = data;
    }
    return response;
  };

  const updateContactInfo = async (data) => {
    const payload = contactInfoMapper(data);
    const response = await personalInfoService.updateContactInfo(payload);
    if (response.status === 200) {
      contactInfo.value = data;
    }
    return response;
  };

  const updateProfileInfo = async (data) => {
    const formData = profileInfoMapper(data);
    const response = await personalInfoService.updateProfileInfo(formData);
    if (response.status === 200) {
      profileInfo.value = {
        ...profileInfo.value,
        ...data,
      };
    }
    return response;
  };

  return {
    personalInfo,
    contactInfo,
    profileInfo,
    updatePersonalInfo,
    updateContactInfo,
    updateProfileInfo,
  };
});

export default usePersonalInfoStore;
