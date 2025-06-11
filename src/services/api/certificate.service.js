import axios from '../axios';
import { certificateMapper } from '@/mappers/certificate/certificate.mapper';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getCertificates = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/certificate',
  });
};

export const createCertificate = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/resume/resume/certificate',
    data: certificateMapper(data),
  });
};

export const updateCertificate = (id, data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/resume/resume/certificate/${id}`,
    data: certificateMapper(data),
  });
};

export const deleteCertificate = (id) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/resume/resume/certificate/${id}`,
  });
};

export default {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
