<script setup>
import Toast from '@/plugins/toast';
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  icon: {
    type: Object,
    validator: (value) => {
      return !!value.name;
    },
  },
  id: {
    type: String,
    default: '',
  },
  actions: {
    type: Array,
    validator: (value) => {
      return value.some((item) => !(!item.label || !item.callback));
    },
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  isMultiAction: {
    type: Boolean,
    default: false,
  },
});

const toast = new Toast();

const setHoverActive = () => {
  Toast.isHover.value = true;
};

const setHoverInactive = () => {
  Toast.isHover.value = false;
};

const handleHideToast = () => {
  toast.hideToast(props.id);
};

const iconProps = {
  name: props.icon?.name,
  variant: props.icon?.variant ?? 'outlined',
};

const actionsCondition = computed(() => ({
  showSingleAction: !props.isMultiAction && props.actions?.length,
  showMultiAction: props.isMultiAction && props.actions?.length,
  showToastAction: props.showCloseButton || props.actions?.length,
}));

const toastActionsClass = computed(() => ({
  'actions--single': actionsCondition.value.showSingleAction || (props.showCloseButton && !props.isMultiAction),
}));

const singleAction = computed(() => props.actions?.[0]);
</script>

<template>
  <div
    class="toast"
    :class="{ 'toast--multiple': isMultiAction }"
    @mouseenter="setHoverActive"
    @mouseleave="setHoverInactive"
  >
    <div class="toast__content">
      <div class="toast__icon-box">
        <svg-loader v-if="icon?.name" v-bind="iconProps" class="toast__icon" />
      </div>
      <p class="toast__text">{{ message }} </p>
    </div>

    <div v-if="actionsCondition.showToastAction" class="actions" :class="toastActionsClass">
      <template v-if="actionsCondition.showSingleAction">
        <span v-if="singleAction" @click="singleAction.callback" class="actions__custom-action">
          {{ singleAction.label }}
        </span>
      </template>

      <template v-else-if="actionsCondition.showMultiAction">
        <span
          v-for="actionItem in actions"
          :key="actionItem"
          @click="actionItem.callback"
          class="actions__custom-action"
          >{{ actionItem.label }}</span
        >
      </template>

      <svg-loader
        v-if="showCloseButton"
        name="close"
        class="actions__hide-action"
        variant="outlined"
        @click="handleHideToast"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$root: 'toast';
$toast-types: error info success;

.#{$root} {
  gap: 10px;
  width: 100%;
  display: flex;
  cursor: pointer;
  max-width: 320px;
  min-width: 300px;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  border-radius: 10px;

  transition-property: all;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0;

  color: color(surface);
  background-color: color(on-surface);

  &--multiple {
    flex-direction: column;
  }

  &__text {
    direction: rtl;
    max-width: 90%;
    overflow-wrap: anywhere;
  }

  &__message {
    flex: 90%;
  }

  &__icon {
    width: remify(30);
    height: remify(30);
  }

  &__icon-box {
    width: remify(30);
    height: remify(30);
  }

  &__content {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    align-items: center;
  }
}

.actions {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: end;

  &--single {
    max-width: fit-content;
  }

  &__hide-action {
    width: 24px;
    height: 24px;
    color: #fcfdff;
  }

  &__custom-action {
    color: #2aa8ba;
  }
}
</style>
