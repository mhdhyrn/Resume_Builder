<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/Button.component.vue';
import { authRoutes } from '@/constants/router';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);
const router = useRouter();

const handleLogin = () => {
  router.push({ name: authRoutes.LOGIN_NAME });
  emit('close');
};

const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="auth-modal">
      <div class="auth-modal__backdrop" @click="handleCancel" />
      <div class="auth-modal__content">
        <h3 class="auth-modal__title">نیاز به احراز هویت</h3>
        <p class="auth-modal__description">
          برای دسترسی به این بخش نیاز به ورود به حساب کاربری دارید.
        </p>
        <div class="auth-modal__actions">
          <Button text="ورود" @click="handleLogin" />
          <Button text="بیخیال" variant="outline" color="error" @click="handleCancel" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.auth-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  @include flex($justify: center, $align: center);

  &__backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  &__content {
    position: relative;
    width: 90%;
    max-width: remify(400);
    background-color: color(surface-container);
    border-radius: radius(lg);
    border: 1px solid color(outline);
    padding: space(6);
    @include flex($direction: column, $gap: space(4));
  }

  &__title {
    color: color(on-surface);
    @include typography('xl', 'bold');
  }

  &__description {
    color: color(on-surface-variant);
    @include typography('md', 'medium');
  }

  &__actions {
    @include flex($justify: flex-end, $gap: space(2));
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>
