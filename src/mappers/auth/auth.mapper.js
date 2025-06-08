/**
 * @param {string} phoneNumber
 * @returns {{ phone_number: string }}
 */
function verifyUserMapper(phoneNumber) {
  return {
    phone_number: phoneNumber,
  };
}

/**
 * @param {string} phoneNumber
 * @param {string} otp
 * @returns {{ phone_number: string, otp_code: string }}
 */
function verifyOtpMapper(phoneNumber, otp) {
  return {
    phone_number: phoneNumber,
    otp_code: otp,
  };
}

export { verifyUserMapper, verifyOtpMapper };
