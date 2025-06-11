import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import { mapLanguageFromAPI } from '@/mappers/language/language.mapper';
import {
  getLanguages as getLanguagesAPI,
  createLanguage as createLanguageAPI,
  updateLanguage as updateLanguageAPI,
  deleteLanguage as deleteLanguageAPI,
} from '@/services/api/languages.service';

export const languagesStore = defineStore('languages', () => {
  const languages = ref([]);

  // Get Languages
  const { execute: fetchLanguages, isLoading: languagesLoading } = usePromise(async () => {
    const { data } = await getLanguagesAPI();
    languages.value = data.map(mapLanguageFromAPI);
    return data;
  });

  // Create Language
  const { execute: addLanguage, isLoading: createLoading } = usePromise(async (languageData) => {
    const { data } = await createLanguageAPI(languageData);
    const mappedData = mapLanguageFromAPI(data);
    languages.value.push(mappedData);
    return mappedData;
  });

  // Update Language
  const { execute: updateLanguage, isLoading: updateLoading } = usePromise(
    async (id, languageData) => {
      const { data } = await updateLanguageAPI(id, languageData);
      const mappedData = mapLanguageFromAPI(data);
      const index = languages.value.findIndex((lang) => lang.id === id);
      if (index !== -1) {
        languages.value[index] = mappedData;
      }
      return mappedData;
    },
  );

  // Delete Language
  const { execute: deleteLanguage, isLoading: deleteLoading } = usePromise(async (id) => {
    await deleteLanguageAPI(id);
    const index = languages.value.findIndex((lang) => lang.id === id);
    if (index !== -1) {
      languages.value.splice(index, 1);
    }
  });

  return {
    languages,
    languagesLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
  };
});
