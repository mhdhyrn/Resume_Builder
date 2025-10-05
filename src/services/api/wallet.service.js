import axios from '@/services/axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getWalletBalance = () => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/wallet/balance',
  });
};

export const getMyWalletCharges = (params = { skip: 0, limit: 100 }) => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/wallet/charges',
    params,
  });
};

export const createWalletCharge = ({ amount, receipt }) => {
  const formData = new FormData();
  formData.append('amount', amount);
  formData.append('receipt', receipt);

  return axios({
    baseURL,
    method: 'POST',
    url: '/wallet/charges',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  getWalletBalance,
  getMyWalletCharges,
  createWalletCharge,
};
