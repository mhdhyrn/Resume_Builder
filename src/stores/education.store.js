import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import { mapEducationFromAPI } from '@/mappers/education/education.mapper';
import {
  getEducations as getEducationsAPI,
  createEducation as createEducationAPI,
  updateEducation as updateEducationAPI,
  deleteEducation as deleteEducationAPI,
} from '@/services/api/education.service';

export const educationStore = defineStore('education', () => {
  const educations = ref([]);

  // Get Educations
  const { execute: fetchEducations, loading: educationsLoading } = usePromise(async () => {
    const { data } = await getEducationsAPI();
    educations.value = data.map(mapEducationFromAPI);
    return data;
  });

  // Create Education
  const { execute: createEducation, loading: createLoading } = usePromise(async (educationData) => {
    const { data } = await createEducationAPI(educationData);
    const mappedData = mapEducationFromAPI(data);
    educations.value.push(mappedData);
    return mappedData;
  });

  // Update Education
  const { execute: updateEducation, loading: updateLoading } = usePromise(
    async (id, educationData) => {
      const { data } = await updateEducationAPI(id, educationData);
      const mappedData = mapEducationFromAPI(data);
      const index = educations.value.findIndex((edu) => edu.id === id);
      if (index !== -1) {
        educations.value[index] = mappedData;
      }
      return mappedData;
    },
  );

  // Delete Education
  const { execute: deleteEducation, loading: deleteLoading } = usePromise(async (id) => {
    await deleteEducationAPI(id);
    const index = educations.value.findIndex((edu) => edu.id === id);
    if (index !== -1) {
      educations.value.splice(index, 1);
    }
  });

  return {
    educations,
    educationsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchEducations,
    createEducation,
    updateEducation,
    deleteEducation,
  };
});
