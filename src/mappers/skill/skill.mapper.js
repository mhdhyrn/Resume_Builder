export function skillMapper(data) {
  return {
    name: data.name,
    proficiency: data.proficiency,
  };
}

export function mapSkillFromAPI(data) {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    proficiency: data.proficiency,
  };
} 