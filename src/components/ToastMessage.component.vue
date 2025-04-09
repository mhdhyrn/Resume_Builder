<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: String,
  },
  iconName: {
    type: String,
    default: 'close-circle',
  },
  autoClose: {
    type: [Number, Boolean],
  },
  type: {
    type: String,
    default: 'error',
  },
});

const TYPE_MAP = {
  error: {
    iconColor: 'var(--error)',
    iconName: 'close-circle',
    title: 'خطا',
  },
  warning: {
    iconColor: 'var(--warning)',
    iconName: 'danger-triangle',
    title: 'هشدار',
  },
  success: {
    iconColor: 'var(--success)',
    iconName: 'check-circle',
    title: 'موفق',
  },
  info: {
    iconColor: 'var(--info)',
    iconName: 'danger-circle',
    title: 'اطلاعیه',
  },
};

const typeModel = computed(() => TYPE_MAP[props.type]);
const iconColor = computed(() => typeModel.value.iconColor);
</script>
<template>
  <div class="custom-toast">
    <div class="custom-toast__header">
      <div class="custom-toast__header-title">
        <InfraSvgLoader :name="typeModel.iconName" class="custom-toast__icon" />
        <span>{{ typeModel.title }}</span>
      </div>
      <div>
        <InfraSvgLoader class="custom-toast__icon" name="close" />
      </div>
    </div>
    <div class="custom-toast__body">
      <span class="custom-toast__content">{{ content }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-toast {
  --icon-color: v-bind(iconColor);
  gap: space(2);
  padding: space(2.5);

  @include dimension(100%, 100%);
  @include flex(column, nowrap, flex-start, flex-start);

  &__header {
    border-bottom: 0.3px solid var(--icon-color);
    padding-bottom: space(2.5);
    @include flex(row, nowrap, center, space-between);
    @include dimension(100%, auto);

    &-title {
      display: flex;
      gap: 10px;
      @include typography(title-medium);
    }
  }

  &__content {
    flex: 1;
    @include typography(body-medium);
  }

  &__icon {
    color: var(--icon-color);
    @include dimension(24px, 24px);
  }
}
</style>
