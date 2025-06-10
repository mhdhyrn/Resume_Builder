import axios from '../axios';
import { workExperienceMapper } from '@/mappers/work-experience/work-experience.mapper';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getWorkExperiences = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/work-experience',
  });
};

export const createWorkExperience = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/resume/resume/work-experience',
    data: workExperienceMapper(data),
  });
};

export const updateWorkExperience = (id, data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/resume/resume/work-experience/${id}`,
    data: workExperienceMapper(data),
  });
};

export const deleteWorkExperience = (id) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/resume/resume/work-experience/${id}`,
  });
};

export default {
  getWorkExperiences,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
};
