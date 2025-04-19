<template>
  <div class="toast-container">
    <div class="toast-message">
      <TransitionGroup name="toast-message" appear>
        <template v-for="toast in toastsList" :key="toast.id">
          <ToastMessage v-bind="toast" />
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Toast from '@/plugins/toast';
import ToastMessage from './ToastMessage.component.vue';

const toastsList = computed(() => Toast.toasts);
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  z-index: 1000;
  top: 2%;
  left: 2%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-message {
  direction: rtl;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-enter-active {
    transition: all 0.3s ease-out;
  }

  &-leave-active {
    transition: all 0.8s ease-in;
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
