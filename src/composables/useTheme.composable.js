import { ref, watchEffect } from 'vue';

const useTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const theme = ref(savedTheme || systemPreference);

  theme.value = theme.value === 'light' ? 'light' : 'dark';

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  watchEffect(() => {
    document.documentElement.setAttribute('theme', theme.value);
    localStorage.setItem('theme', theme.value);
  });

  return { theme, toggleTheme };
};

export default useTheme;
