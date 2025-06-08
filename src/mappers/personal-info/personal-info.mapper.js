/**
 * @param {Object} data
 * @param {string} data.gender
 * @param {boolean} data.isMarried
 * @param {string} data.militaryServiceStatus
 * @param {string} data.aboutMe
 */
export function personalInfoMapper(data) {
  return {
    gender: data.gender,
    is_married: data.isMarried,
    military_service_status: data.militaryServiceStatus,
    about_me: data.aboutMe,
  };
}

/**
 * @param {Object} data
 * @param {string} data.phoneNumber
 * @param {string} data.email
 * @param {string} data.landline
 * @param {string} data.website
 * @param {string} data.country
 * @param {string} data.province
 * @param {string} data.city
 * @param {string} data.address
 */
export function contactInfoMapper(data) {
  return {
    phone_number: data.phoneNumber,
    email: data.email,
    landline: data.landline,
    website: data.website,
    country: data.country,
    province: data.province,
    city: data.city,
    address: data.address,
  };
}

/**
 * @param {Object} data
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.birthDate
 * @param {File} data.profilePicture
 */
export function profileInfoMapper(data) {
  const formData = new FormData();

  if (data.firstName) formData.append('first_name', data.firstName);
  if (data.lastName) formData.append('last_name', data.lastName);
  if (data.birthDate) formData.append('birth_date', data.birthDate);
  if (data.profilePicture) formData.append('profile_picture', data.profilePicture);

  return formData;
}
