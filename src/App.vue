<script setup>
import Layout from '@/layouts/layout.vue';
import ToastContainer from '@/components/ToastContainer.component.vue';
import Modal from '@/components/Modal.component.vue';
import { useTheme } from '@/composables';
import { useModalStore } from '@/stores/modal.store';
import { useRouter } from 'vue-router';
import { authRoutes } from '@/constants/router';
import Button from '@/components/Button.component.vue';

const modalStore = useModalStore();
const router = useRouter();
useTheme();

function handleLoginOk() {
  router.push({ name: authRoutes.LOGIN_NAME });
  modalStore.closeAuthModal();
}

function handleProfileOk() {
  router.push({ name: authRoutes.PROFILE_COMPLETION_NAME });
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
      @close="modalStore.closeAuthModal"
    >
      <p class="modal-text">برای دسترسی به این بخش نیاز به ورود به حساب کاربری دارید.</p>
      <template #footer>
        <Button text="ورود به حساب کاربری" @click="handleLoginOk" />
      </template>
    </Modal>
    <Modal
      :isOpen="modalStore.isProfileModalOpen"
      title="تکمیل پروفایل"
      @close="modalStore.closeProfileModal"
    >
      <p class="modal-text">لطفا اطلاعات پروفایل خود را تکمیل کنید.</p>
      <template #footer>
        <Button text="تکمیل اطلاعات" @click="handleProfileOk" />
      </template>
    </Modal>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &.btn-primary {
    background-color: var(--primary);
    color: white;
    border: none;

    &:hover {
      background-color: var(--primary-dark);
    }
  }
}

.modal-text {
  color: color(on-surface);
  @include typography(md);
  margin-bottom: space(4);
  line-height: 1.6;
}
</style>
