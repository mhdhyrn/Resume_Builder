import axios from '../axios';
import { educationMapper } from '@/mappers/education/education.mapper';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getEducations = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/education',
  });
};

export const createEducation = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/resume/resume/education',
    data: educationMapper(data),
  });
};

export const updateEducation = (id, data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/resume/resume/education/${id}`,
    data: educationMapper(data),
  });
};

export const deleteEducation = (id) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/resume/resume/education/${id}`,
  });
};

export default {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
};
