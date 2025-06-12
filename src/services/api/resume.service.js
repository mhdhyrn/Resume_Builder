import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getResume = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume',
  });
};

export const downloadResume = (templateId) => {
  return axios({
    method: 'GET',
    baseURL,
    url: `/pdf/generate`,
    params: {
      template: templateId,
    },
    responseType: 'blob',
  });
};
