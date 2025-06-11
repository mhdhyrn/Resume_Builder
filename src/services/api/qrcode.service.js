import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const generateQRCode = (url) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/qrcode/generate',
    data: { url },
    responseType: 'blob',
  });
};
