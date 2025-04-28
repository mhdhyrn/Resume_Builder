import { onMounted, onUnmounted } from 'vue';

function useOnClickOutside(elementRef, callback) {
  const handler = (e) => {
    if (elementRef.value && !elementRef.value.contains(e.target)) {
      callback(e);
    }
  };

  onMounted(() => {
    window.addEventListener('click', handler);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handler);
  });
}

export default useOnClickOutside;
