import { SessionStorage } from '@shared/services';

const sessionStorage = new SessionStorage();

function validateResponse(response) {}

const getItemFromSession = (key) => sessionStorage.get(key);

const isAuthenticated = () => {
  return !!getItemFromSession('access_token');
};

const setHeaders = (config) => {
  config.headers = {
    ...config.headers,
    'Cache-Control': 'no-cache',
    'gateway-system': getItemFromSession('gateway-system'),
  };
  if (isAuthenticated()) {
    config.headers['gateway-token'] = getItemFromSession('access_token');
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
