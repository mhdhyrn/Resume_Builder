<script setup>
import { onMounted } from 'vue';
import { useProgressStore } from '@/stores/progress.store';
import CircularProgress from '@/components/CircularProgress.component.vue';
import { getResume } from '@/services/api/resume.service';

const progressStore = useProgressStore();

onMounted(async () => {
  try {
    // دریافت اطلاعات رزومه و بررسی پیشرفت
    const response = await getResume();
    progressStore.checkAllSections(response.data);
  } catch (error) {
    console.error('خطا در دریافت اطلاعات رزومه:', error);
  }
});
</script>

<template>
  <div class="resume-form-layout">
    <div class="progress-container">
      <CircularProgress :progress="progressStore.totalProgress" />
    </div>
    <div class="form-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resume-form-layout {
  display: flex;
  flex-direction: column;
  gap: space(4);
  padding: space(4);
  max-width: 800px;
  margin: 0 auto;
}

.progress-container {
  display: flex;
  justify-content: center;
  padding: space(4);
  background-color: color(surface);
  border-radius: radius(lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-content {
  background-color: color(surface);
  border-radius: radius(lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
