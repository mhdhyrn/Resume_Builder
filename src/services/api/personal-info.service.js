import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getPersonalInfo = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/personal-info',
  });
};

export const getContactInfo = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/contact-info',
  });
};

export const getUserProfile = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/users/me',
  });
};

export const updatePersonalInfo = (data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: '/resume/resume/personal-info',
    data,
  });
};

export const updateContactInfo = (data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: '/resume/resume/contact-info',
    data,
  });
};

export const updateProfileInfo = (formData) => {
  return axios({
    method: 'PATCH',
    baseURL,
    url: '/users/profile',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  getPersonalInfo,
  getContactInfo,
  getUserProfile,
  updatePersonalInfo,
  updateContactInfo,
  updateProfileInfo,
};
