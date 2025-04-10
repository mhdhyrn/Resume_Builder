const mobileNumber = (value) => {
  try {
    if (!value) {
      return true;
    }
    if (value.match(/^(09)[0-9]{9}$|^(۰۹)[۰۱۲۳۴۵۶۷۸۹]{9}$|^(٠٩)[٩٨٧٦٥٤٣٢١٠]{9}$/)) return true;
    else return 'شماره موبایل معتبر نمی باشد';
  } catch (e) {
    return 'شماره موبایل معتبر نمی باشد';
  }
};

export default {
  mobileNumber,
};
