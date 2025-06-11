<template>
  <div class="main">
    <div class="title">دانلود رزومه</div>
    <div class="form">
      <div class="description">رزومه شما آماده دانلود است</div>
      <div class="subtitle">لطفاً قالب مورد نظر خود را انتخاب کنید:</div>

      <div class="templates-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card"
          :class="{ selected: selectedTemplate?.id === template.id }"
          @click="selectTemplate(template)"
        >
          <img :src="template.image" :alt="template.title" class="template-image" />
          <div class="template-title">{{ template.title }}</div>
        </div>
      </div>

      <div class="submit-row">
        <Button
          class="submit-btn"
          v-bind="submitButtonConfig"
          type="submit"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from '../Button.component.vue';
import LoadingComponent from '../Loading.component.vue';
import templates from '@/constants/templates.constant';

const selectedTemplate = ref(null);
const isButtonLoading = ref(false);

const submitButtonConfig = reactive({
  text: 'دانلود رزومه',
  isDisabled: computed(() => !selectedTemplate.value),
  isLoading: computed(() => isButtonLoading.value),
});

const handleSubmit = () => {
  if (!selectedTemplate.value) return;

  isButtonLoading.value = true;
  // TODO: اینجا باید به API درخواست دانلود رزومه ارسال شود
  setTimeout(() => {
    isButtonLoading.value = false;
  }, 1000);
};

const selectTemplate = (template) => {
  selectedTemplate.value = template;
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @include flex($direction: column, $justify: center, $align: center, $gap: space(5));
}

.title {
  width: 70%;
  @include typography(lg, bold);
}

.form {
  background-color: color(surface);
  padding: 2rem;
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  width: 70%;
}

.description {
  text-align: center;
  @include typography(md);
  margin-bottom: space(5);
}

.subtitle {
  @include typography(md, bold);
  margin-bottom: space(4);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: space(4);
  margin-bottom: space(6);
}

.template-card {
  background-color: color(surface);
  border: 2px solid color(disabled-soft);
  border-radius: radius(lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: color(primary);
    box-shadow: 0 0 0 2px color(primary-soft);
  }
}

.template-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid color(disabled-soft);
}

.template-title {
  padding: space(3);
  text-align: center;
  @include typography(md, bold);
}

.submit-row {
  margin-top: space(4);
  text-align: left;
  @include flex($justify: end, $align: center);
}

.submit-btn {
  width: remify(300);
}
</style>
