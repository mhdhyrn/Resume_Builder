const SERVER_BASE_URL = 'http://37.32.24.212:8000';

export const getServerUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${SERVER_BASE_URL}${path}`;
};
