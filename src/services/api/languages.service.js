import axios from '../axios';
import { languageMapper } from '@/mappers/language/language.mapper';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getLanguages = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/language',
  });
};

export const createLanguage = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/resume/resume/language',
    data: languageMapper(data),
  });
};

export const updateLanguage = (id, data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/resume/resume/language/${id}`,
    data: languageMapper(data),
  });
};

export const deleteLanguage = (id) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/resume/resume/language/${id}`,
  });
};

export default {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
