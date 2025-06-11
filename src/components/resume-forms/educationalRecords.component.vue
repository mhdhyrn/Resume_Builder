<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import TextField from '../TextField.component.vue';
import Button from '../Button.component.vue';
import DropdownComponent from '../Dropdown.component.vue';
import { useRouter } from 'vue-router';
import { educationStore } from '@/stores/education.store';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { useProgress } from '@/composables/useProgress';
import { useProgressbarStore } from '@/stores/progressbar.store';

const router = useRouter();
const store = educationStore();
const progressStore = useProgressStore();
const { updateProgress } = useProgress();
const progressbarStore = useProgressbarStore();
const isLoading = ref(true);

const emptyForm = {
  degree: '',
  major: '',
  universityType: '',
  universityName: '',
  grade: '',
  entranceYear: '',
  graduationYear: '',
  country: 'ایران',
  province: '',
  city: '',
  isCurrent: false,
};

const formFields = ref({ ...emptyForm });
const editingId = ref(null);

const universityTypes = [
  { label: 'دولتی', value: 'public' },
  { label: 'آزاد', value: 'private' },
  { label: 'پیام نور', value: 'payam_noor' },
  { label: 'غیرانتفاعی', value: 'non_profit' },
];

const degrees = [
  { label: 'دیپلم', value: 'diploma' },
  { label: 'کاردانی', value: 'associate' },
  { label: 'کارشناسی', value: 'bachelor' },
  { label: 'کارشناسی ارشد', value: 'master' },
  { label: 'دکتری', value: 'phd' },
];

// Helper functions
const getDegreeLabel = (value) => {
  const degree = degrees.find((d) => d.value === value);
  return degree ? degree.label : value;
};

const getUniversityTypeLabel = (value) => {
  const type = universityTypes.find((t) => t.value === value);
  return type ? type.label : value;
};

// Load educations
onMounted(async () => {
  try {
    await store.fetchEducations();
  } catch (error) {
    notify({
      message: 'خطا در دریافت اطلاعات',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  formFields.value = { ...emptyForm };
  editingId.value = null;
};

const editEducation = (education) => {
  formFields.value = {
    degree: education.degree || '',
    major: education.major || '',
    universityType: education.universityType || '',
    universityName: education.universityName || '',
    grade: education.grade || '',
    entranceYear: education.entranceYear?.toString() || '',
    graduationYear: education.graduationYear?.toString() || '',
    country: education.country || 'ایران',
    province: education.province || '',
    city: education.city || '',
    isCurrent: education.isCurrent || false,
  };

  // Force update dropdown values
  nextTick(() => {
    const degreeOption = degrees.find((d) => d.value === education.degree);
    const universityTypeOption = universityTypes.find((t) => t.value === education.universityType);

    if (degreeOption) {
      formFields.value.degree = degreeOption.value;
    }

    if (universityTypeOption) {
      formFields.value.universityType = universityTypeOption.value;
    }
  });

  editingId.value = education.id;
};

const handleSubmit = async () => {
  try {
    const formData = {
      ...formFields.value,
      entranceYear: parseInt(formFields.value.entranceYear),
      graduationYear: formFields.value.graduationYear
        ? parseInt(formFields.value.graduationYear)
        : null,
    };

    if (editingId.value) {
      await store.updateEducation(editingId.value, formData);
      notify({
        message: 'سابقه تحصیلی با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      const response = await store.createEducation(formData);
      if (store.educations.length === 1) {
        await progressbarStore.updateProgressbar();
      }
      notify({
        message: 'سابقه تحصیلی با موفقیت اضافه شد',
        type: 'success',
      });
    }
    resetForm();
  } catch (error) {
    notify({
      message: error.message || 'خطا در ذخیره اطلاعات',
      type: 'error',
    });
  }
};

const handleDelete = async (id) => {
  try {
    await store.deleteEducation(id);
    if (store.educations.length === 0) {
      await progressbarStore.updateProgressbar();
    }
    notify({
      message: 'سابقه تحصیلی با موفقیت حذف شد',
      type: 'success',
    });
    if (editingId.value === id) {
      resetForm();
    }
  } catch (error) {
    notify({
      message: error.message || 'خطا در حذف اطلاعات',
      type: 'error',
    });
  }
};

const handleNext = () => {
  router.push({ name: 'ResumeForms', query: { step: 'experienceRecords' } });
};

const isFormValid = computed(() => {
  return (
    formFields.value.degree &&
    formFields.value.major &&
    formFields.value.universityType &&
    formFields.value.universityName &&
    formFields.value.entranceYear &&
    formFields.value.country &&
    formFields.value.province &&
    formFields.value.city
  );
});
</script>

<template>
  <div class="main">
    <div class="loading-container" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div class="title">سوابق تحصیلی</div>

      <!-- لیست سوابق تحصیلی -->
      <div v-if="store.educations.length > 0" class="education-list">
        <div v-for="education in store.educations" :key="education.id" class="education-card">
          <div class="education-info">
            <h3>{{ education.universityName }}</h3>
            <p>{{ education.major }} - {{ getDegreeLabel(education.degree) }}</p>
            <p>{{ education.entranceYear }} تا {{ education.graduationYear }}</p>
            <p>{{ getUniversityTypeLabel(education.universityType) }}</p>
          </div>
          <div class="education-actions">
            <button class="edit-btn" @click="editEducation(education)">ویرایش</button>
            <button class="delete-btn" @click="handleDelete(education.id)">حذف</button>
          </div>
        </div>
      </div>

      <!-- فرم -->
      <form class="form" @submit.prevent="handleSubmit">
        <div class="grid">
          <DropdownComponent
            v-model="formFields.degree"
            :options="degrees"
            label="مقطع تحصیلی"
            rules="required"
          />
          <TextField v-model="formFields.major" label="رشته تحصیلی" rules="required" />
          <DropdownComponent
            v-model="formFields.universityType"
            :options="universityTypes"
            label="نوع دانشگاه"
            rules="required"
          />
          <TextField v-model="formFields.universityName" label="نام دانشگاه" rules="required" />
          <TextField v-model="formFields.grade" label="معدل" />
          <TextField
            v-model="formFields.entranceYear"
            label="سال ورود"
            type="number"
            rules="required"
          />
          <TextField v-model="formFields.graduationYear" label="سال فراغت از تحصیل" type="number" />
          <TextField v-model="formFields.country" label="کشور" rules="required" />
          <TextField v-model="formFields.province" label="استان" rules="required" />
          <TextField v-model="formFields.city" label="شهر" rules="required" />
        </div>

        <div class="form-actions">
          <Button
            :text="editingId ? 'ویرایش سابقه تحصیلی' : 'افزودن سابقه تحصیلی'"
            :is-loading="store.createLoading || store.updateLoading"
            :is-disabled="!isFormValid"
            type="submit"
          />
          <Button v-if="editingId" color="warning" text="انصراف" type="button" @click="resetForm" />
        </div>
        <!-- دکمه مرحله بعد -->
        <div class="next-step">
          <Button text="مرحله بعد" @click="handleNext" />
        </div>
      </form>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  @include flex($direction: column, $justify: center, $align: center, $gap: space(5));
}

.loading-container {
  width: 70%;
  height: 100%;
}

.title {
  width: 70%;
  @include typography(lg, bold);
}

.education-list {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: space(3);
  margin-bottom: space(5);
}

.education-card {
  background-color: color(surface);
  padding: space(4);
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .education-info {
    h3 {
      @include typography(md, bold);
      margin-bottom: space(2);
    }

    p {
      @include typography(sm);
      color: color(on-surface-variant);
      margin-bottom: space(1);
    }
  }

  .education-actions {
    display: flex;
    gap: space(2);
  }
}

.form {
  background-color: color(surface);
  padding: 2rem;
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  width: 70%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.form-actions {
  width: 50%;
  margin-top: space(4);
  display: flex;
  gap: space(2);
  justify-content: flex-end;
}

.next-step {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: space(10);

  button {
    width: 30%;
  }
}

.edit-btn {
  padding: space(2) space(4);
  background-color: color(secondary);
  color: color(on-secondary);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
}

.delete-btn {
  padding: space(2) space(4);
  background-color: color(error);
  color: color(on-error);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
}
</style>
