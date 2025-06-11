<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { useProgressStore } from '@/stores/progress.store';

const progressStore = useProgressStore();

// در متد handleSubmit:
const handleSubmit = async () => {
  try {
    const response = await updatePersonalInfo(form.value);
    // بررسی پیشرفت بعد از ذخیره موفق
    progressStore.checkSectionCompletion('personalInfo', response.data);
  } catch (error) {
    console.error('خطا در ذخیره اطلاعات:', error);
  }
};

// ... rest of the component ...
</script>
