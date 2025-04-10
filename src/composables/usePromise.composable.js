import { ref } from 'vue';
const defaultConfig = {
  throwOnError: false,
  onError: async (error) => console.error(error),
};

export const usePromise = (promise, { onError, throwOnError = true } = defaultConfig) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);

  const execute = async (...params) => {
    if (loading.value) return;

    loading.value = true;

    try {
      data.value = await promise(...params);
      return Promise.resolve(data.value);
    } catch (error) {
      error.value = error;
      if (onError) await onError(error);
      if (throwOnError) return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  };

  return { data, error, execute, loading };
};

export default usePromise;
