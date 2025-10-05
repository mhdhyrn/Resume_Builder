<script setup>
import { ref, computed } from 'vue';
import SvgLoader from './SvgLoader.component.vue';

const props = defineProps({
  value: {
    type: [File, String, null],
    default: null,
  },
  accept: {
    type: String,
    default: '*/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024, // 5MB
  },
  label: {
    type: String,
    default: 'انتخاب فایل',
  },
  hint: {
    type: String,
    default: '',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:value', 'select', 'remove']);

const fileInput = ref(null);
const isDragOver = ref(false);
const error = ref('');

const hasFile = computed(() => !!props.value);
const fileName = computed(() => {
  if (props.value instanceof File) {
    return props.value.name;
  }
  if (typeof props.value === 'string' && props.value) {
    return props.value.split('/').pop();
  }
  return '';
});

const fileSize = computed(() => {
  if (props.value instanceof File) {
    return (props.value.size / 1024 / 1024).toFixed(2) + ' MB';
  }
  return '';
});

const openFileDialog = () => {
  if (!props.isDisabled) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  const file = files[0];
  validateFile(file);
};

const validateFile = (file) => {
  error.value = '';

  if (file.size > props.maxSize) {
    error.value = `حجم فایل نباید بیشتر از ${(props.maxSize / 1024 / 1024).toFixed(0)} مگابایت باشد`;
    return;
  }

  emit('update:value', file);
  emit('select', file);
};

const removeFile = () => {
  emit('update:value', null);
  emit('remove');
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  if (!props.isDisabled) {
    isDragOver.value = true;
  }
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;

  if (props.isDisabled) return;

  const files = Array.from(event.dataTransfer.files);
  if (files.length > 0) {
    validateFile(files[0]);
  }
};
</script>

<template>
  <div class="file-uploader">
    <div
      class="file-uploader__dropzone"
      :class="{
        'file-uploader__dropzone--drag-over': isDragOver,
        'file-uploader__dropzone--disabled': isDisabled,
        'file-uploader__dropzone--has-file': hasFile,
      }"
      @click="openFileDialog"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="isDisabled"
        @change="handleFileSelect"
        class="file-uploader__input"
      />

      <div v-if="!hasFile" class="file-uploader__placeholder">
        <SvgLoader name="upload" class="file-uploader__icon" />
        <span class="file-uploader__text">{{ label }}</span>
        <span class="file-uploader__subtext">فایل را اینجا بکشید یا کلیک کنید</span>
      </div>

      <div v-else class="file-uploader__file-info">
        <SvgLoader name="file" class="file-uploader__file-icon" />
        <div class="file-uploader__file-details">
          <span class="file-uploader__file-name">{{ fileName }}</span>
          <span v-if="fileSize" class="file-uploader__file-size">{{ fileSize }}</span>
        </div>
        <button
          type="button"
          class="file-uploader__remove"
          @click.stop="removeFile"
          :disabled="isDisabled"
        >
          <SvgLoader name="close" class="file-uploader__remove-icon" />
        </button>
      </div>
    </div>

    <p v-if="hint && !error" class="file-uploader__hint">{{ hint }}</p>
    <p v-if="error" class="file-uploader__error">{{ error }}</p>
  </div>
</template>

<style lang="scss" scoped>
.file-uploader {
  width: 100%;
}

.file-uploader__dropzone {
  border: 2px dashed color(outline);
  border-radius: radius(lg);
  padding: space(6);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: color(surface);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover:not(.file-uploader__dropzone--disabled) {
    border-color: color(primary);
    background: color(primary-container);
  }

  &--drag-over {
    border-color: color(primary);
    background: color(primary-container);
    transform: scale(1.02);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--has-file {
    border-style: solid;
    border-color: color(success);
    background: color(success-container);
  }
}

.file-uploader__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.file-uploader__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: space(2);
  color: color(on-surface-variant);
}

.file-uploader__icon {
  width: 32px;
  height: 32px;
  color: color(primary);
}

.file-uploader__text {
  font-weight: 600;
  color: color(on-surface);
}

.file-uploader__subtext {
  font-size: 0.875rem;
  color: color(on-surface-variant);
}

.file-uploader__file-info {
  display: flex;
  align-items: center;
  gap: space(3);
  width: 100%;
}

.file-uploader__file-icon {
  width: 24px;
  height: 24px;
  color: color(success);
  flex-shrink: 0;
}

.file-uploader__file-details {
  display: flex;
  flex-direction: column;
  gap: space(1);
  flex: 1;
  text-align: right;
}

.file-uploader__file-name {
  font-weight: 600;
  color: color(on-surface);
  word-break: break-all;
}

.file-uploader__file-size {
  font-size: 0.875rem;
  color: color(on-surface-variant);
}

.file-uploader__remove {
  background: color(error-container);
  border: none;
  border-radius: radius(sm);
  padding: space(1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: color(error);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.file-uploader__remove-icon {
  width: 16px;
  height: 16px;
  color: color(on-error-container);
}

.file-uploader__hint {
  margin-top: space(2);
  font-size: 0.875rem;
  color: color(on-surface-variant);
}

.file-uploader__error {
  margin-top: space(2);
  font-size: 0.875rem;
  color: color(error);
}
</style>
