import axios from '../axios';

const baseURL = 'baseURL';

export const verifyUser = ({ phone_number, password }) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/auth/login',
    data: {
      phone_number,
      password,
    },
  });
};

export default {
  verifyUser,
};
