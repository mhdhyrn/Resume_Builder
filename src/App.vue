<script setup>
import Layout from '@/layouts/layout.vue';
import ToastContainer from '@/components/ToastContainer.component.vue';
import Modal from '@/components/Modal.component.vue';
import { useTheme } from '@/composables';
import { useModalStore } from '@/stores/modal.store';
import { useRouter } from 'vue-router';
import { authRoutes } from '@/constants/router';

const modalStore = useModalStore();
const router = useRouter();
useTheme();

function handleLoginOk() {
  router.push({ name: authRoutes.LOGIN_NAME });
  modalStore.closeAuthModal();
}
function handleLoginCancel() {
  modalStore.closeAuthModal();
}
function handleProfileOk() {
  router.push({ name: authRoutes.PROFILE_COMPLETION_NAME });
  modalStore.closeProfileModal();
}
function handleProfileCancel() {
  modalStore.closeProfileModal();
}
</script>

<template>
  <div>
    <Layout>
      <RouterView />
    </Layout>
    <ToastContainer />
    <Modal
      :isOpen="modalStore.isAuthModalOpen"
      title="نیاز به احراز هویت"
      description="برای دسترسی به این بخش نیاز به ورود به حساب کاربری دارید."
      okText="ورود"
      cancelText="بیخیال"
      @ok="handleLoginOk"
      @cancel="handleLoginCancel"
    />
    <Modal
      :isOpen="modalStore.isProfileModalOpen"
      title="تکمیل پروفایل"
      description="لطفا اطلاعات پروفایل خود را تکمیل کنید."
      okText="تکمیل اطلاعات"
      cancelText="بیخیال"
      @ok="handleProfileOk"
      @cancel="handleProfileCancel"
    />
  </div>
</template>

<style lang="scss" scoped></style>
