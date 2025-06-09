import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const isAuthModalOpen = ref(false);
  const isProfileModalOpen = ref(false);

  const openAuthModal = () => {
    isAuthModalOpen.value = true;
  };

  const openProfileModal = () => {
    isProfileModalOpen.value = true;
  };

  const closeAuthModal = () => {
    isAuthModalOpen.value = false;
  };

  const closeProfileModal = () => {
    isProfileModalOpen.value = false;
  };

  return {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
  };
});

export default useModalStore;
