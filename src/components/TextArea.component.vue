<script setup>
import SvgLoader from './SvgLoader.component.vue';

const modelValue = defineModel({
  type: [String, Number],
  required: true,
});

const props = defineProps({
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
    default: 'required',
  },
  maxlength: {
    type: Number,
    default: null,
  },
  name: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
});

const { value: fieldValue, errorMessage } = useField(props.name, props.rules, {
  label: props.label,
  syncVModel: true,
});

const textarea = ref();

watch(
  () => props.error,
  (newError) => {
    errorMessage.value = newError;
  },
);
</script>

<template>
  <div class="textarea" :class="{ 'textarea--error': errorMessage }">
    <div class="textarea__container">
      <slot name="prependIcon" v-if="prependIcon">
        <SvgLoader :name="prependIcon" class="textarea__icon textarea__icon--prepend" />
      </slot>
      <div class="textarea__field-container">
        <label v-if="label" :for="name" class="textarea__label">
          {{ label }}
        </label>
        <textarea
          ref="textarea"
          :id="name"
          v-model="fieldValue"
          :placeholder="placeholder"
          :disabled="isDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :rows="rows"
          :class="['textarea__field', fieldValue ? 'has-value' : '']"
        />
      </div>
      <slot name="appendIcon" v-if="appendIcon">
        <SvgLoader :name="appendIcon" class="textarea__icon textarea__icon--append" />
      </slot>
    </div>
    <p v-if="hint && !errorMessage" class="textarea__hint">{{ hint }}</p>
    <p class="textarea__error">{{ errorMessage }}</p>
  </div>
</template>

<style lang="scss" scoped>
.textarea {
  color: color(on-surface);
  @include flex($direction: column, $gap: space(1));

  &__field-container {
    position: relative;
    width: 100%;
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
    top: space(2);
    right: space(3);
    color: color(on-surface);
    transition: all 0.2s;
    @include typography('md', 'medium');
  }

  &__container {
    border: 1px solid color(outline-variant);
    border-radius: radius('lg');
    padding: space(2);
    transition: border 0.3s;
    @include flex($align: flex-start);
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
    resize: vertical;
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

  &__icon {
    width: remify(25);

    &--append {
      margin-left: space(1);
    }
    &--prepend {
      margin-right: space(1);
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
