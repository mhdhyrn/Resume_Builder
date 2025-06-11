<script setup>
import { ref, computed, onMounted } from 'vue';
import TextField from '../TextField.component.vue';
import Button from '../Button.component.vue';
import { useRouter } from 'vue-router';
import { skillStore } from '@/stores/skill.store';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import DropdownComponent from '../Dropdown.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { useProgressbarStore } from '@/stores/progressbar.store';

const router = useRouter();
const store = skillStore();
const progressStore = useProgressStore();
const progressbarStore = useProgressbarStore();
const isLoading = ref(true);

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
  { label: 'حرفه‌ای', value: 'expert' },
];

// Helper function to get proficiency label
const getProficiencyLabel = (value) => {
  const level = proficiencyLevels.find((l) => l.value === value);
  return level ? level.label : value;
};

// Load skills
onMounted(async () => {
  try {
    await store.fetchSkills();
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

const editSkill = (skill) => {
  formFields.value = {
    name: skill.name || '',
    proficiency: skill.proficiency || '',
  };
  editingId.value = skill.id;
};

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await store.updateSkill(editingId.value, formFields.value);
      notify({
        message: 'مهارت با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      const response = await store.createSkill(formFields.value);
      if (store.skills.length === 1) {
        await progressbarStore.updateProgressbar();
      }
      notify({
        message: 'مهارت با موفقیت اضافه شد',
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
    await store.deleteSkill(id);
    if (store.skills.length === 0) {
      await progressbarStore.updateProgressbar();
    }
    notify({
      message: 'مهارت با موفقیت حذف شد',
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
  router.push({ name: 'ResumeForms', query: { step: 'languages' } });
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
      <div class="title">مهارت‌ها</div>

      <!-- لیست مهارت‌ها -->
      <div v-if="store.skills.length > 0" class="skills-list">
        <div v-for="skill in store.skills" :key="skill.id" class="skill-card">
          <div class="skill-info">
            <h3>{{ skill.name }}</h3>
            <p>{{ getProficiencyLabel(skill.proficiency) }}</p>
          </div>
          <div class="skill-actions">
            <button class="edit-btn" @click="editSkill(skill)">ویرایش</button>
            <button class="delete-btn" @click="handleDelete(skill.id)">حذف</button>
          </div>
        </div>
      </div>

      <!-- فرم -->
      <form class="form" @submit.prevent="handleSubmit">
        <div class="grid">
          <TextField v-model="formFields.name" label="نام مهارت" rules="required" />
          <DropdownComponent
            v-model="formFields.proficiency"
            :options="proficiencyLevels"
            label="سطح مهارت"
            rules="required"
          />
        </div>

        <div class="form-actions">
          <Button
            :text="editingId ? 'ویرایش مهارت' : 'افزودن مهارت'"
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

.skills-list {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: space(3);
  margin-bottom: space(5);
}

.skill-card {
  background-color: color(surface);
  padding: space(4);
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .skill-info {
    h3 {
      @include typography(md, bold);
      margin-bottom: space(2);
    }

    p {
      @include typography(sm);
      color: color(on-surface-variant);
    }
  }

  .skill-actions {
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
