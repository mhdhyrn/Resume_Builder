import axios from '@/services/axios';
import { getServerUrl } from '@/utils/url';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getMyResumeHistory = (params = { skip: 0, limit: 50 }) => {
  return axios({
    baseURL,
    method: 'GET',
    url: '/pdf/history',
    params,
  });
};

export const downloadResumeById = async (resumeId) => {
  const response = await axios({
    baseURL,
    method: 'GET',
    url: `/pdf/download/${resumeId}`,
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // تلاش برای گرفتن نام فایل از هدر، در غیر اینصورت پیش‌فرض
  const cd = response?.headers?.['content-disposition'] || '';
  const match = /filename="?([^";]+)"?/i.exec(cd);
  const fileName = match?.[1] || `resume-${resumeId}.pdf`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default {
  getMyResumeHistory,
  downloadResumeById,
};

