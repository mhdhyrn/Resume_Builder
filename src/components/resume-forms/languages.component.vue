<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import TextField from '../TextField.component.vue';
import Button from '../Button.component.vue';
import { useRouter } from 'vue-router';
import { languagesStore } from '@/stores/languages.store';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import DropdownComponent from '../Dropdown.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { useProgressbarStore } from '@/stores/progressbar.store';

const router = useRouter();
const store = languagesStore();
const progressStore = useProgressStore();
const progressbarStore = useProgressbarStore();
const isLoading = ref(true);

const languagesLength = computed(() => store.languages.length);

const emptyForm = {
  name: '',
  proficiency: '',
};

const formFields = ref({ ...emptyForm });
const editingId = ref(null);

const proficiencyLevels = [
  { label: 'مبتدی', value: 'beginner' },
  { label: 'متوسط', value: 'intermediate' },
  { label: 'پیشرفته', value: 'advanced' },
  { label: 'زبان مادری', value: 'native' },
];

// Helper function to get proficiency label
const getProficiencyLabel = (value) => {
  const level = proficiencyLevels.find((l) => l.value === value);
  return level ? level.label : value;
};

// Load languages
onMounted(async () => {
  try {
    await store.fetchLanguages();
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

const editLanguage = (language) => {
  formFields.value = {
    name: language.name || '',
    proficiency: language.proficiency || '',
  };
  editingId.value = language.id;
};

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await store.updateLanguage(editingId.value, formFields.value);
      notify({
        message: 'زبان با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      const response = await store.addLanguage(formFields.value);
      if (store.languages.length === 1) {
        await progressbarStore.updateProgressbar();
      }
      notify({
        message: 'زبان با موفقیت اضافه شد',
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
    await store.deleteLanguage(id);
    if (store.languages.length === 0) {
      await progressbarStore.updateProgressbar();
    }
    notify({
      message: 'زبان با موفقیت حذف شد',
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
  router.push({ name: 'ResumeForms', query: { step: 'certificates' } });
};

const isFormValid = computed(() => {
  return formFields.value.name && formFields.value.proficiency;
});
</script>

<template>
  <div class="main">
    <div class="loading-container" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div class="title">زبان‌ها</div>

      <!-- لیست زبان‌ها -->
      <div v-if="store.languages.length > 0" class="languages-list">
        <TransitionGroup name="list">
          <div v-for="language in store.languages" :key="language.id" class="language-card">
            <div class="language-info">
              <h3>{{ language.name }}</h3>
              <p>{{ getProficiencyLabel(language.proficiency) }}</p>
            </div>
            <div class="language-actions">
              <button class="edit-btn" @click="editLanguage(language)">ویرایش</button>
              <button class="delete-btn" @click="handleDelete(language.id)">حذف</button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- فرم -->
      <form class="form" @submit.prevent="handleSubmit">
        <div class="grid">
          <TextField v-model="formFields.name" label="نام زبان" rules="required" name="name" />
          <DropdownComponent
            v-model="formFields.proficiency"
            :options="proficiencyLevels"
            label="سطح زبان"
            rules="required"
            name="proficiency"
          />
        </div>

        <div class="form-actions">
          <Button
            :text="editingId ? 'ویرایش زبان' : 'افزودن زبان'"
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

.languages-list {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: space(3);
  margin-bottom: space(5);

  @media (max-width: 768px) {
    width: 90%;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.language-card {
  background-color: color(surface);
  padding: space(4);
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .language-info {
    h3 {
      @include typography(md, bold);
      margin-bottom: space(2);
    }

    p {
      @include typography(sm);
      color: color(on-surface-variant);
    }
  }

  .language-actions {
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
