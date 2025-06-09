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
  if (data.birthDate) {
    // Ensure date is in YYYY-MM-DD format with '-' separator
    let birthDate = data.birthDate;
    if (typeof birthDate === 'string') {
      birthDate = birthDate.replace(/\//g, '-');
    }
    formData.append('birth_date', birthDate);
  }
  if (data.profilePicture) formData.append('profile_picture', data.profilePicture);

  return formData;
}

/**
 * @param {Object} data
 * @param {string} data.gender
 * @param {boolean} data.is_married
 * @param {string} data.military_service_status
 * @param {string} data.about_me
 */
export function mapPersonalInfoFromAPI(data) {
  return {
    gender: data.gender,
    isMarried: data.is_married,
    militaryServiceStatus: data.military_service_status,
    aboutMe: data.about_me,
  };
}

/**
 * @param {Object} data
 * @param {string} data.phone_number
 * @param {string} data.email
 * @param {string} data.landline
 * @param {string} data.website
 * @param {string} data.country
 * @param {string} data.province
 * @param {string} data.city
 * @param {string} data.address
 */
export function mapContactInfoFromAPI(data) {
  return {
    phoneNumber: data.phone_number,
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
 * @param {string} data.phone_number
 * @param {string} data.first_name
 * @param {string} data.last_name
 * @param {string} data.profile_picture
 * @param {string} data.birth_date
 */
export function mapUserProfileFromAPI(data) {
  return {
    phoneNumber: data.phone_number,
    firstName: data.first_name,
    lastName: data.last_name,
    profilePicture: data.profile_picture,
    birthDate: data.birth_date,
  };
}
