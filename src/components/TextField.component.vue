<script setup>
import EyeIcon from '@/assets/icons/eye.svg';
import EyeSlashIcon from '@/assets/icons/eye-slash.svg';
import SvgLoader from './SvgLoader.component.vue';

const modelValue = defineModel({
  type: [String, Number],
  required: true,
});

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (val) => ['text', 'password', 'email', 'number', 'tel'].includes(val),
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
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
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  rules: {
    type: [String, Array],
    default: '',
  },
  maxlength: {
    type: Number,
    default: null,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  name: {
    type: String,
    default: '',
  },
});

const { value: fieldValue, errorMessage } = useField(props.name, props.rules, {
  label: props.label,
  syncVModel: true,
});

const input = ref();
const showPassword = ref(false);
const isPassword = computed(() => props.type === 'password');
const computedType = computed(() => {
  if (isPassword.value) {
    if (!showPassword.value) return 'password';
    return 'text';
  }
  return props.type;
});
const passwordIcon = computed(() => {
  return showPassword.value ? 'eye' : 'eye-slash';
});

const togglePasswordVisibility = async () => {
  showPassword.value = !showPassword.value;
  await nextTick();
  input.value.focus();
  const length = input.value.value.length;

  input.value.setSelectionRange(length, length);
};

watch(
  () => props.error,
  (newError) => {
    errorMessage.value = newError;
  },
);
</script>

<template>
  <div class="input" :class="{ 'input--error': errorMessage }">
    <div class="input__container">
      <slot name="append-icon" v-if="prependIcon">
        <SvgLoader :name="prependIcon" class="input__icon input__icon--prepend" />
      </slot>
      <div class="input__field-container">
        <label v-if="label" :for="name" class="input__label">
          {{ label }}
        </label>
        <input
          ref="input"
          :id="name"
          v-model="fieldValue"
          :type="computedType"
          :placeholder="placeholder"
          :disabled="isDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          :class="['input__field', fieldValue ? 'has-value' : '']"
        />
      </div>
      <button
        v-if="isPassword"
        type="button"
        class="input__toggle-password"
        @click="togglePasswordVisibility"
      >
        <SvgLoader :name="passwordIcon" class="input__icon--password" />
      </button>
      <slot name="prepend-icon" v-if="appendIcon">
        <SvgLoader :name="appendIcon" class="input__icon input__icon--append" />
      </slot>
    </div>
    <p v-if="hint && !errorMessage" class="input__hint">{{ hint }}</p>
    <p class="input__error">{{ errorMessage }}</p>
  </div>
</template>

<style lang="scss" scoped>
.input {
  color: color(on-surface);
  @include flex($direction: column, $gap: space(1));

  &__field-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 space(1);
  }

  &:focus-within &__label,
  &:has(.has-value) &__label {
    top: 0;
    right: space(2);
    color: color(outline);
    @include typography('sm', 'medium');
  }
  &__label {
    position: absolute;
    top: space(3);
    right: space(3);
    color: color(on-surface);
    transition: all 0.2s;
    @include typography('md', 'medium');
  }

  &__container {
    border: 1px solid color(outline-variant);
    border-radius: radius('lg');
    height: remify(55);
    padding: space(1) space(2);
    transition: border 0.3s;
    @include flex($align: center);
  }

  &:focus-within &__container {
    border-color: color(primary);
  }

  &:focus-within:has(.error) &__container {
    border-color: color(error);
  }

  &__field {
    width: 100%;
    border: none;
    outline: none;
    padding: space(1);
    text-align: right;
    color: color(on-surface);
    margin-top: space(4);
    @include typography('md', 'medium');

    &::placeholder {
      color: color(outline);
      @include typography('md', 'light');
    }
  }

  &__hint {
    color: color(outline);
    @include typography('sm', 'medium');
  }

  &__error {
    height: remify(25);
    color: color(error);
    @include typography('sm', 'medium');
  }

  &__toggle-password {
    background: none;
    border: none;
    cursor: pointer;
    @include flex($align: center, $justify: center);
  }

  &__icon {
    width: remify(25);
    &--append {
      margin-left: space(1);
    }
    &--prepend {
      margin-right: space(1);
    }
    &--password {
      color: color(outline);
    }
  }

  &--error:focus-within &__container {
    border-color: color(error);
  }

  &--error &__container {
    border-color: color(error);
  }
}
</style>
