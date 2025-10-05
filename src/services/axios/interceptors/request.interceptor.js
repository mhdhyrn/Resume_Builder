function validateResponse(response) {}

const getItemFromSession = (key) => sessionStorage.getItem(key);

const isAuthenticated = () => {
  return !!sessionStorage.getItem('access_token') || !!sessionStorage.getItem('admin_access_token');
};

const setHeaders = (config) => {
  const existingHeaders = config.headers || {};

  config.headers = {
    ...existingHeaders,
    'Cache-Control': 'no-cache',
  };

  const isAdmin = sessionStorage.getItem('is_admin') === 'true';
  const userToken = sessionStorage.getItem('access_token');
  const adminToken = sessionStorage.getItem('admin_access_token');

  if (isAuthenticated()) {
    const token = isAdmin && adminToken ? adminToken : userToken;
    if (token) config.headers['authorization'] = `Bearer ${token}`;
  }
};

const onFulfilled = (config) => {
  setHeaders(config);

  return Promise.resolve(config);
};

const onRejected = (error) => {
  return Promise.reject(error);
};

export default { onRejected, onFulfilled };
