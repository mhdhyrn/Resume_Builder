import axios from '../axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = (userId) => {
  return axios({
    method: 'GET',
    baseURL,
    url: `/users/profile/${userId}`,
  });
};
