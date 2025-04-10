function validateResponse(response) {}

const getItemFromSession = (key) => sessionStorage.getItem(key);

const isAuthenticated = () => {
  return !!sessionStorage.getItem('access-token');
};

const setHeaders = (config) => {
  config.headers = {
    ...config.headers,
    'Cache-Control': 'no-cache',
  };
  if (isAuthenticated()) {
    config.headers['token'] = sessionStorage.getItem('access-token');
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
