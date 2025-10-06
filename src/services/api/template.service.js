import axios from '@/services/axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getTemplates = (params = {}) => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/admin/template/',
    params,
  });
};

export const getTemplateById = (templateId) => {
  return axios({
    baseURL,
    method: 'GET',
    url: `/admin/template/${templateId}`,
  });
};

export const createTemplate = (formData) => {
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
    baseURL,
    method: 'PUT',
    url: `/admin/template/${templateId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTemplate = (templateId) => {
  return axios({
    baseURL,
    method: 'DELETE',
    url: `/admin/template/${templateId}`,
  });
};

export const toggleTemplateStatus = (templateId) => {
  return axios({
    baseURL,
    method: 'PUT',
    url: `/admin/template/${templateId}/toggle-status`,
  });
};

export const updateTemplateSortOrder = (templateId, sortOrder) => {
  return axios({
    baseURL,
    method: 'PUT',
    url: `/admin/template/${templateId}/sort-order`,
    params: { sort_order: sortOrder },
  });
};

export default {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
  updateTemplateSortOrder,
};

// Public template options for end-users
export const getTemplateOptions = () => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/template/options',
  });
};

export const purchaseTemplate = (templateId) => {
  return axios({
    baseURL,
    method: 'POST',
    url: '/template/purchase',
    data: { template_id: templateId },
  });
};
