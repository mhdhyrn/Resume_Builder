<script setup>
import Button from '@/components/Button.component.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: 'تایید',
  },
  cancelText: {
    type: String,
    default: 'بیخیال',
  },
});

const emit = defineEmits(['ok', 'cancel']);

const handleOk = () => {
  emit('ok');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal">
      <div class="modal__backdrop" @click="handleCancel" />
      <div class="modal__content">
        <h3 class="modal__title">{{ title }}</h3>
        <p class="modal__description">
          {{ description }}
        </p>
        <div class="modal__actions">
          <Button :text="okText" @click="handleOk" />
          <Button :text="cancelText" variant="outline" color="error" @click="handleCancel" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.auth-modal,
.modal {
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
