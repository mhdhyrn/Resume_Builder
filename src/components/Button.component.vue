<script setup>
import { useClassModifier } from '@/composables';
import SvgLoader from './SvgLoader.component.vue';

const props = defineProps({
  text: {
    String,
    default: 'ثبت',
  },
  type: {
    type: String,
    default: 'button',
    validator: (val) => ['button', 'submit', 'reset'].includes(val),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (val) =>
      ['primary', 'secondary', 'error', 'warning', 'info', 'surface-bright'].includes(val),
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (val) => ['filled', 'outline', 'text'].includes(val),
  },
  size: {
    type: String,
    default: 'x-large',
    validator: (val) =>
      [
        '3x-small',
        '2x-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        '2x-large',
        '3x-large',
      ].includes(val),
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  appendIcon: {
    type: String,
    default: '',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  rounded: {
    type: String,
    default: 'medium',
    validator: (val) =>
      [
        '3x-small',
        '2x-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        '2x-large',
        '3x-large',
      ].includes(val),
  },
  handler: {
    type: Function,
    default: () => {},
  },
});

const classConditions = computed(() => [
  { condition: props.isDisabled, modifier: '--disabled' },
  { condition: props.variant, modifier: `--${props.variant}` },
  {
    condition: props.color && props.variant,
    modifier: `--${props.variant}-${props.color}`,
  },
  { condition: props.rounded, modifier: `--rounded-${props.rounded}` },
  { condition: props.size, modifier: `--${props.size}` },
]);

const classModifiers = useClassModifier('button', classConditions);
</script>

<template>
  <button
    @click="handler"
    :class="['button', ...classModifiers]"
    :type="type"
    :disabled="isDisabled || isLoading"
  >
    <slot name="left-icon" v-if="prependIcon">
      <SvgLoader :name="prependIcon" class="button__icon button__icon--prepend" />
    </slot>

    <span v-if="isLoading" class="button__loader"></span>
    <slot v-else>{{ text }}</slot>

    <slot name="right-icon" v-if="appendIcon">
      <SvgLoader :name="appendIcon" class="button__icon button__icon--append" />
    </slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  @extend .button;

  width: 100%;
  height: var(--btn-height);
  color: var(--btn-text-color);
  background-color: var(--btn-bg-color);
  border-radius: var(--btn-rounded);
  padding: space(2);
  @include flex($justify: center, $align: center, $gap: space(2));
  @include typography('md', 'medium');

  &:hover {
    cursor: pointer;
  }

  &__icon {
    width: remify(16);
    height: remify(16);
    color: var(--btn-text-color);
  }

  &__loader {
    width: remify(16);
    height: remify(16);
    border: 2px solid transparent;
    border-top: 2px solid var(--btn-text-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  &--disabled {
    background-color: color(disabled-soft);
    color: color(disabled-strong);
  }
}
</style>
