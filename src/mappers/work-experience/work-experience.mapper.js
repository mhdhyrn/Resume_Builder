// تابع کمکی برای تبدیل تاریخ از فرمت فارسی به فرمت سرور
const convertToServerDate = (persianDate) => {
  if (!persianDate) return null;
  // تبدیل 1402/01/01 به 2024-03-20
  const [year, month, day] = persianDate.split('/');
  return `${year}-${month}-${day}`;
};

// تابع کمکی برای تبدیل تاریخ از فرمت سرور به فرمت فارسی
const convertToPersianDate = (serverDate) => {
  if (!serverDate) return '';
  // تبدیل 2024-03-20 به 1402/01/01
  const [year, month, day] = serverDate.split('-');
  return `${year}/${month}/${day}`;
};

export function workExperienceMapper(data) {
  return {
    position: data.position,
    company_name: data.companyName,
    country: data.country,
    province: data.province,
    city: data.city,
    start_date: convertToServerDate(data.startDate),
    end_date: data.isCurrent ? null : convertToServerDate(data.endDate),
    is_current: data.isCurrent,
    description: data.description,
  };
}

export function mapWorkExperienceFromAPI(data) {
  return {
    id: data.id,
    userId: data.user_id,
    position: data.position,
    companyName: data.company_name,
    country: data.country,
    province: data.province,
    city: data.city,
    startDate: convertToPersianDate(data.start_date),
    endDate: convertToPersianDate(data.end_date),
    isCurrent: data.is_current,
    description: data.description,
  };
}
