import axios from '../axios';
import { skillMapper } from '@/mappers/skill/skill.mapper';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getSkills = () => {
  return axios({
    method: 'GET',
    baseURL,
    url: '/resume/resume/skill',
  });
};

export const createSkill = (data) => {
  return axios({
    method: 'POST',
    baseURL,
    url: '/resume/resume/skill',
    data: skillMapper(data),
  });
};

export const updateSkill = (id, data) => {
  return axios({
    method: 'PUT',
    baseURL,
    url: `/resume/resume/skill/${id}`,
    data: skillMapper(data),
  });
};

export const deleteSkill = (id) => {
  return axios({
    method: 'DELETE',
    baseURL,
    url: `/resume/resume/skill/${id}`,
  });
};

export default {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
