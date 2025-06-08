<script setup>
import { ref, watch } from 'vue';
import SvgLoader from './SvgLoader.component.vue';

const emit = defineEmits(['select', 'remove']);

const selectedFile = ref(null);
const previewUrl = ref(null);
const fileInput = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    emit('select', file);

    // ریست مقدار input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } else {
    reset();
  }
};

const reset = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  emit('remove');

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<template>
  <div class="image-picker">
    <div class="preview">
      <img v-if="previewUrl" :src="previewUrl" alt="preview" class="preview__image" />
      <SvgLoader v-else name="profile-avatar" class="preview__image" />
    </div>

    <input
      type="file"
      accept="image/*"
      @change="onFileChange"
      ref="fileInput"
      class="image-picker__input"
      id="imageInput"
      hidden
    />
    <div class="image-picker__actions">
      <label for="imageInput" class="btn"> انتخاب تصویر</label>

      <button class="btn btn--danger" @click="reset" v-if="previewUrl">حذف</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-picker {
  width: 250px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview__image {
  width: 150px;
  height: 150px;
  border-radius: 100px;
  object-fit: cover;
  border: 2px solid color(disabled-strong);
  color: color(on-surface);
}

.image-picker__actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: color(secondary);
  border-radius: 8px;
  color: color(on-primary);
  cursor: pointer;
  border: none;
}

.btn--danger {
  background-color: color(error);
}
</style>
