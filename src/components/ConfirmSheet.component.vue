<script setup>
import { useForm } from 'vee-validate';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: false,
    default: true,
  },
  title: {
    type: String,
    default: 'عملیات را تایید می کنید ؟',
  },
  message: {
    type: String,
    default: 'آیا از انجام این فرایند اطمینان دارید؟',
  },
  submitButtonText: {
    default: 'تایید',
    type: String,
  },
  cancelButtonText: {
    default: 'انصراف',
    type: String,
  },
  isConfirmLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
  isConfirmDisabled: {
    type: Boolean,
    required: false,
    default: true,
  },
  isCancelDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  persist: {
    type: Boolean,
    required: false,
  },
  titleIcon: {
    type: String,
    default: '',
  },
  submitButtonColor: {
    type: String,
    required: false,
    default: 'error',
  },
  cancelButtonColor: {
    type: String,
    required: false,
    default: 'surface-bright',
  },
});
const emits = defineEmits(['submit', 'cancel']);
const { meta: formMeta } = useForm();

const onCancel = () => {
  emits('cancel');
};
const onSubmit = () => {
  emits('submit');
};
</script>

<template>
  <UBottomSheet :is-open="isOpen" :persist="persist" :title="title" :titleIcon="titleIcon">
    <div class="confirm-sheet">
      <!-- <slot name="header">
        <div class="confirm-sheet__title title">
          <div class="title__message-wrapper">
            <svg-loader v-if="titleIcon" :name="titleIcon" class="title__icon" />
            <h3 class="title__message">{{ title }}</h3>
          </div>
          <hr class="confirm-sheet__line" />
        </div>
      </slot> -->
      <div class="confirm-sheet__body">
        <slot name="body">
          <p v-if="message" class="confirm-sheet__description">
            {{ message }}
          </p>
        </slot>
      </div>
      <slot name="action">
        <div class="confirm-sheet__actions">
          <UButton @click="onCancel" :color="cancelButtonColor" class="confirm-sheet__buttons" :is-disabled="isCancelDisabled">{{
            cancelButtonText
          }}</UButton>
          <UButton
            class="confirm-sheet__buttons"
            @click="onSubmit"
            :color="submitButtonColor"
            :isLoading="isConfirmLoading"
            :is-disabled="!formMeta.valid"
            >{{ submitButtonText }}</UButton
          >
        </div>
      </slot>
    </div>
  </UBottomSheet>
</template>

<style lang="scss" scoped>
.confirm-sheet {
  padding-bottom: space(2);
  @include flex($direction: column, $align: space-between);

  &__body {
    gap: space(2);
    @include flex($direction: column, $align: start);
  }
  &__description {
    padding: 0 space(4);
    color: color(on-surface-variant);
    @include typography(body-medium);
  }

  &__actions {
    padding: 0 space(4);
    width: 100%;
    gap: space(4);
    margin-top: remify(48px);
    @include flex($justify: space-between);
  }
  &__buttons {
    width: 50%;
  }
}


</style>
