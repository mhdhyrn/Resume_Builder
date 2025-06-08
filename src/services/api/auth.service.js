import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const verifyUser = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/auth/request-otp',
    data,
  });
};

export const verifyOtp = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/auth/verify-otp',
    data,
  });
};

export default {
  verifyUser,
  verifyOtp,
};
