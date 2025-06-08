function validateResponse(response) {}

const getItemFromSession = (key) => sessionStorage.getItem(key);

const isAuthenticated = () => {
  return !!sessionStorage.getItem('access_token');
};

const setHeaders = (config) => {
  const existingHeaders = config.headers || {};

  config.headers = {
    ...existingHeaders,
    'Cache-Control': 'no-cache',
  };

  if (isAuthenticated()) {
    config.headers['authorization'] = `Bearer ${sessionStorage.getItem('access_token')}`;
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
