import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import {
  personalInfoMapper,
  contactInfoMapper,
  profileInfoMapper,
  mapPersonalInfoFromAPI,
  mapContactInfoFromAPI,
  mapUserProfileFromAPI,
} from '@/mappers/personal-info/personal-info.mapper';
import {
  updatePersonalInfo as updatePersonalInfoAPI,
  updateContactInfo as updateContactInfoAPI,
  updateProfileInfo as updateProfileInfoAPI,
  getPersonalInfo as getPersonalInfoAPI,
  getContactInfo as getContactInfoAPI,
  getUserProfile as getUserProfileAPI,
} from '@/services/api/personal-info.service';

export const personalInfoStore = defineStore('personalInfo', () => {
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

  // Get Personal Info
  const { execute: fetchPersonalInfo, loading: personalInfoLoading } = usePromise(async () => {
    const { data } = await getPersonalInfoAPI();
    personalInfo.value = mapPersonalInfoFromAPI(data);
    return data;
  });

  // Get Contact Info
  const { execute: fetchContactInfo, loading: contactInfoLoading } = usePromise(async () => {
    const { data } = await getContactInfoAPI();
    contactInfo.value = mapContactInfoFromAPI(data);
    return data;
  });

  // Get User Profile
  const { execute: fetchUserProfile, loading: userProfileLoading } = usePromise(async () => {
    const { data } = await getUserProfileAPI();
    profileInfo.value = mapUserProfileFromAPI(data);
    return data;
  });

  // Fetch All Data
  const fetchAllData = async () => {
    try {
      await Promise.all([fetchPersonalInfo(), fetchContactInfo(), fetchUserProfile()]);
    } catch (error) {
      throw error;
    }
  };

  // Update Personal Info
  const { execute: updatePersonalInfo } = usePromise(async (data) => {
    const mappedData = personalInfoMapper(data);
    const response = await updatePersonalInfoAPI(mappedData);
    personalInfo.value = { ...personalInfo.value, ...data };
    return response;
  });

  // Update Contact Info
  const { execute: updateContactInfo } = usePromise(async (data) => {
    const mappedData = contactInfoMapper(data);
    const response = await updateContactInfoAPI(mappedData);
    contactInfo.value = { ...contactInfo.value, ...data };
    return response;
  });

  // Update Profile Info
  const { execute: updateProfileInfo } = usePromise(async (data) => {
    const formData = profileInfoMapper(data);
    const response = await updateProfileInfoAPI(formData);
    profileInfo.value = { ...profileInfo.value, ...data };
    return response;
  });

  return {
    personalInfo,
    contactInfo,
    profileInfo,
    personalInfoLoading,
    contactInfoLoading,
    userProfileLoading,
    fetchPersonalInfo,
    fetchContactInfo,
    fetchUserProfile,
    fetchAllData,
    updatePersonalInfo,
    updateContactInfo,
    updateProfileInfo,
  };
});

export default personalInfoStore;
