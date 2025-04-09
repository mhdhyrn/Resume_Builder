import axios from '../axios';
import { getServiceBaseUrl } from '@/utils/index.js';

const userManager = getServiceBaseUrl('USER_MANAGER');

export const getCaptcha = () => {
  return axios({
    method: 'GET',
    baseURL: userManager,
    url: '/service/userManager@1/getCaptcha',
    showToast: false,
  });
};

export const login = ({ username, password, captcha }) => {
  return axios({
    method: 'POST',
    url: '/service/userManager@1/login',
    baseURL: userManager,
    data: {
      username,
      password,
      captcha,
    },
  });
};

export default {
  getCaptcha,
  login,
};
