import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getResume = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume',
  });
};

export const downloadResume = (templateId, templateName) => {
  return axios({
    method: 'GET',
    baseURL,
    url: `/pdf/generate`,
    params: {
      template_id: templateId,
      template_name: templateName,
    },
    responseType: 'blob',
  });
};
