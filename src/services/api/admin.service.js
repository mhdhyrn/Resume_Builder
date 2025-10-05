import axios from '@/services/axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const adminLogin = (data) => {
  console.log(data);

  return axios({
    baseURL,
    method: 'POST',
    url: '/admin/login',
    data,
  });
};

export const getWalletCharges = (params = {}) => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/admin/wallet/charges',
    params,
  });
};

export const acceptWalletCharge = (chargeId) => {
  return axios({
    baseURL,
    method: 'POST',
    url: `/admin/wallet/charges/${chargeId}/accept`,
  });
};

export const rejectWalletCharge = (chargeId) => {
  return axios({
    baseURL,
    method: 'POST',
    url: `/admin/wallet/charges/${chargeId}/reject`,
  });
};

// Template Management APIs
export const getTemplates = (params = {}) => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/admin/template/',
    params,
  });
};

export const getTemplate = (templateId) => {
  return axios({
    baseURL,
    method: 'GET',
    url: `/admin/template/${templateId}`,
  });
};

export const createTemplate = (formData) => {
  console.log(formData);

  return axios({
    baseURL,
    method: 'POST',
    url: '/admin/template/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTemplate = (templateId, formData) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/admin/template/${templateId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTemplate = (templateId) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/admin/template/${templateId}`,
  });
};

export const toggleTemplateStatus = (templateId) => {
  return axios({
    method: 'PATCH',
    baseURL,
    url: `/admin/template/${templateId}/toggle-status`,
  });
};

export const updateTemplateSortOrder = (templateId, sortOrder) => {
  return axios({
    method: 'PATCH',
    url: `/admin/template/${templateId}/sort-order`,
    params: { sort_order: sortOrder },
  });
};

export default {
  adminLogin,
  getWalletCharges,
  acceptWalletCharge,
  rejectWalletCharge,
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
  updateTemplateSortOrder,
};
