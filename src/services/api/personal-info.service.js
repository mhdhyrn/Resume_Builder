import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

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
  updatePersonalInfo,
  updateContactInfo,
  updateProfileInfo,
};
