import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import { mapSkillFromAPI } from '@/mappers/skill/skill.mapper';
import {
  getSkills as getSkillsAPI,
  createSkill as createSkillAPI,
  updateSkill as updateSkillAPI,
  deleteSkill as deleteSkillAPI,
} from '@/services/api/skill.service';

export const skillStore = defineStore('skill', () => {
  const skills = ref([]);

  // Get Skills
  const { execute: fetchSkills, loading: skillsLoading } = usePromise(async () => {
    const { data } = await getSkillsAPI();
    skills.value = data.map(mapSkillFromAPI);
    return data;
  });

  // Create Skill
  const { execute: createSkill, loading: createLoading } = usePromise(async (skillData) => {
    const { data } = await createSkillAPI(skillData);
    const mappedData = mapSkillFromAPI(data);
    skills.value.push(mappedData);
    return mappedData;
  });

  // Update Skill
  const { execute: updateSkill, loading: updateLoading } = usePromise(async (id, skillData) => {
    const { data } = await updateSkillAPI(id, skillData);
    const mappedData = mapSkillFromAPI(data);
    const index = skills.value.findIndex((skill) => skill.id === id);
    if (index !== -1) {
      skills.value[index] = mappedData;
    }
    return mappedData;
  });

  // Delete Skill
  const { execute: deleteSkill, loading: deleteLoading } = usePromise(async (id) => {
    await deleteSkillAPI(id);
    const index = skills.value.findIndex((skill) => skill.id === id);
    if (index !== -1) {
      skills.value.splice(index, 1);
    }
  });

  return {
    skills,
    skillsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
});
