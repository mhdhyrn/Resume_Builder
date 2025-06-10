export function educationMapper(data) {
  return {
    degree: data.degree,
    major: data.major,
    university_type: data.universityType,
    university_name: data.universityName,
    grade: data.grade,
    entrance_year: parseInt(data.entranceYear),
    graduation_year: parseInt(data.graduationYear),
    country: data.country,
    province: data.province,
    city: data.city,
    is_current: data.isCurrent,
  };
}

export function mapEducationFromAPI(data) {
  return {
    id: data.id,
    userId: data.user_id,
    degree: data.degree,
    major: data.major,
    universityType: data.university_type,
    universityName: data.university_name,
    grade: data.grade,
    entranceYear: data.entrance_year,
    graduationYear: data.graduation_year,
    country: data.country,
    province: data.province,
    city: data.city,
    isCurrent: data.is_current,
  };
}
