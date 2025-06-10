import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import { mapWorkExperienceFromAPI } from '@/mappers/work-experience/work-experience.mapper';
import {
  getWorkExperiences as getWorkExperiencesAPI,
  createWorkExperience as createWorkExperienceAPI,
  updateWorkExperience as updateWorkExperienceAPI,
  deleteWorkExperience as deleteWorkExperienceAPI,
} from '@/services/api/work-experience.service';

export const workExperienceStore = defineStore('workExperience', () => {
  const workExperiences = ref([]);

  // Get Work Experiences
  const { execute: fetchWorkExperiences, loading: workExperiencesLoading } = usePromise(
    async () => {
      const { data } = await getWorkExperiencesAPI();
      workExperiences.value = data.map(mapWorkExperienceFromAPI);
      return data;
    },
  );

  // Create Work Experience
  const { execute: createWorkExperience, loading: createLoading } = usePromise(
    async (workExperienceData) => {
      const { data } = await createWorkExperienceAPI(workExperienceData);
      const mappedData = mapWorkExperienceFromAPI(data);
      workExperiences.value.push(mappedData);
      return mappedData;
    },
  );

  // Update Work Experience
  const { execute: updateWorkExperience, loading: updateLoading } = usePromise(
    async (id, workExperienceData) => {
      const { data } = await updateWorkExperienceAPI(id, workExperienceData);
      const mappedData = mapWorkExperienceFromAPI(data);
      const index = workExperiences.value.findIndex((exp) => exp.id === id);
      if (index !== -1) {
        workExperiences.value[index] = mappedData;
      }
      return mappedData;
    },
  );

  // Delete Work Experience
  const { execute: deleteWorkExperience, loading: deleteLoading } = usePromise(async (id) => {
    await deleteWorkExperienceAPI(id);
    const index = workExperiences.value.findIndex((exp) => exp.id === id);
    if (index !== -1) {
      workExperiences.value.splice(index, 1);
    }
  });

  return {
    workExperiences,
    workExperiencesLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
  };
});
