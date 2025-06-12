<script setup>
import { ref, computed, onMounted } from 'vue';
import TextField from '../TextField.component.vue';
import TextArea from '../TextArea.component.vue';
import Button from '../Button.component.vue';
import { useRouter } from 'vue-router';
import { workExperienceStore } from '@/stores/work-experience.store';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import DatePickerInput from '../DatePickerInput.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { useProgress } from '@/composables/useProgress';
import { useProgressbarStore } from '@/stores/progressbar.store';
import moment from 'moment-jalaali';

const router = useRouter();
const store = workExperienceStore();
const progressStore = useProgressStore();
const { updateProgress } = useProgress();
const progressbarStore = useProgressbarStore();
const isLoading = ref(true);

const emptyForm = {
  position: '',
  companyName: '',
  country: 'ایران',
  province: '',
  city: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

const formFields = ref({ ...emptyForm });
const editingId = ref(null);

// Load work experiences
onMounted(async () => {
  try {
    await store.fetchWorkExperiences();
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

const editWorkExperience = (experience) => {
  formFields.value = {
    position: experience.position || '',
    companyName: experience.companyName || '',
    country: experience.country || 'ایران',
    province: experience.province || '',
    city: experience.city || '',
    startDate: experience.startDate || '',
    endDate: experience.endDate || '',
    isCurrent: experience.isCurrent || false,
    description: experience.description || '',
  };
  editingId.value = experience.id;
};

const handleSubmit = async () => {
  try {
    let response;
    if (editingId.value) {
      response = await store.updateWorkExperience(editingId.value, formFields.value);
      notify({
        message: 'سابقه کاری با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      response = await store.createWorkExperience(formFields.value);
      if (store.workExperiences.length === 1) {
        await progressbarStore.updateProgressbar();
      }
      notify({
        message: 'سابقه کاری با موفقیت اضافه شد',
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
    await store.deleteWorkExperience(id);
    if (store.workExperiences.length === 0) {
      await progressbarStore.updateProgressbar();
    }
    notify({
      message: 'سابقه کاری با موفقیت حذف شد',
      type: 'success',
    });
  } catch (error) {
    notify({
      message: error.message || 'خطا در حذف اطلاعات',
      type: 'error',
    });
  }
};

const handleNext = () => {
  router.push({ name: 'ResumeForms', query: { step: 'skills' } });
};

const isFormValid = computed(() => {
  return (
    formFields.value.position &&
    formFields.value.companyName &&
    formFields.value.startDate &&
    formFields.value.country &&
    formFields.value.province &&
    formFields.value.city
  );
});

// محدودیت‌های تاریخ
const today = computed(() => {
  return moment().locale('fa').format('jYYYY/jMM/jDD');
});

const startDateMax = computed(() => {
  return formFields.value.endDate || today.value;
});

const endDateMin = computed(() => {
  return formFields.value.startDate || '';
});

const saveExperience = async () => {
  try {
    const response = await store.updateWorkExperience(editingId.value, formFields.value);
    await updateProgress();
    progressStore.checkSectionCompletion('workExperience', response.data);
    notify({
      message: 'سابقه شغلی با موفقیت ویرایش شد',
      type: 'success',
    });
    resetForm();
  } catch (error) {
    console.error('خطا در ذخیره سوابق کاری:', error);
    notify({
      message: error.message || 'خطا در ذخیره سوابق کاری',
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="main">
    <div class="loading-container" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div class="title">سوابق شغلی</div>

      <!-- لیست سوابق شغلی -->
      <div v-if="store.workExperiences.length > 0" class="experience-list">
        <div
          v-for="experience in store.workExperiences"
          :key="experience.id"
          class="experience-card"
        >
          <div class="experience-info">
            <h3>{{ experience.position }}</h3>
            <p>{{ experience.companyName }}</p>
            <p>
              {{ experience.startDate }} تا
              {{ experience.isCurrent ? 'اکنون' : experience.endDate }}
            </p>
            <p>{{ experience.city }}، {{ experience.province }}، {{ experience.country }}</p>
            <p v-if="experience.description" class="description">{{ experience.description }}</p>
          </div>
          <div class="experience-actions">
            <button class="edit-btn" @click="editWorkExperience(experience)">ویرایش</button>
            <button class="delete-btn" @click="handleDelete(experience.id)">حذف</button>
          </div>
        </div>
      </div>

      <!-- فرم -->
      <form class="form" @submit.prevent="handleSubmit">
        <div class="grid">
          <TextField v-model="formFields.position" label="عنوان شغلی" rules="required" />
          <TextField v-model="formFields.companyName" label="نام شرکت" rules="required" />
          <DatePickerInput
            v-model="formFields.startDate"
            label="تاریخ شروع"
            rules="required"
            :max="startDateMax"
          />
          <DatePickerInput
            v-model="formFields.endDate"
            label="تاریخ پایان"
            :rules="formFields.isCurrent ? '' : 'required'"
            :is-disabled="formFields.isCurrent"
            :min="endDateMin"
          />
          <div class="checkbox-wrapper">
            <label>
              <input type="checkbox" v-model="formFields.isCurrent" />
              مشغول به کار هستم
            </label>
          </div>
          <TextField v-model="formFields.country" label="کشور" rules="required" />
          <TextField v-model="formFields.province" label="استان" rules="required" />
          <TextField v-model="formFields.city" label="شهر" rules="required" />
        </div>

        <div class="textarea-wrapper">
          <TextArea v-model="formFields.description" label="توضیحات" />
        </div>

        <div class="form-actions">
          <Button
            :text="editingId ? 'ویرایش سابقه شغلی' : 'افزودن سابقه شغلی'"
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

  @media (max-width: 768px) {
    width: 90%;
  }
}

.experience-list {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: space(3);
  margin-bottom: space(5);

  @media (max-width: 768px) {
    width: 90%;
  }
}

.experience-card {
  background-color: color(surface);
  padding: space(4);
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .experience-info {
    h3 {
      @include typography(md, bold);
      margin-bottom: space(2);
    }

    p {
      @include typography(sm);
      color: color(on-surface-variant);
      margin-bottom: space(1);

      &.description {
        margin-top: space(2);
        white-space: pre-line;
      }
    }
  }

  .experience-actions {
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

  @media (max-width: 768px) {
    width: 90%;
    padding: 1rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: space(2);
  margin-top: space(4);

  label {
    display: flex;
    align-items: center;
    gap: space(2);
    cursor: pointer;
  }
}

.textarea-wrapper {
  margin-top: space(4);
}

.form-actions {
  width: 50%;
  margin-top: space(4);
  display: flex;
  gap: space(2);
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

.next-step {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: space(10);

  button {
    width: 30%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.edit-btn {
  padding: space(2) space(4);
  background-color: color(secondary);
  color: color(on-secondary);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  min-width: 80px;
}

.delete-btn {
  padding: space(2) space(4);
  background-color: color(error);
  color: color(on-error);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  min-width: 80px;
}
</style>
