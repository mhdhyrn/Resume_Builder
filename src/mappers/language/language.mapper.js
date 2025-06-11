export function languageMapper(data) {
  return {
    name: data.name,
    proficiency: data.proficiency,
  };
}

export function mapLanguageFromAPI(data) {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    proficiency: data.proficiency,
  };
}
