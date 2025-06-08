<!-- <template>
  <div class="main">
    <div class="title">مهارت ها</div>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="grid">
        <TextField label="نام مهارت" v-model="form.skillName" />
        <Dropdown :options="dropdownItems" label="میزان تسلط" v-model="form.skillLevel" />
      </div>

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" type="submit"
          >ثبت و رفتن به مرحله ی بعد</Button
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import TextField from '../TextField.component.vue';
import TextArea from '../TextArea.component.vue';
import Button from '../Button.component.vue';
import DatePickerInput from '../DatePickerInput.component.vue';
import CheckBox from '../CheckBox.component.vue';
import { useRouter } from 'vue-router';
import Dropdown from '../Dropdown.component.vue';

const router = useRouter();

const isButtonLoading = ref(false);


const dropdownItems = ['پایین', 'متوسط', 'خوب', 'عالی'];

const submitButtonConfig = reactive({
  isDisabled: computed(() => {
    const isFilled = Object.values(form.value).every((value) => value !== '');
    return !isFilled;
  }),
  isLoading: computed(() => !!isButtonLoading.value),
});

const form = ref({
  skillName: sessionStorage.getItem('skillName') || '',
  skillLevel: sessionStorage.getItem('skillLevel') || '',
});

const handleSubmit = () => {
  isButtonLoading.value = true;
  setTimeout(() => {
    sessionStorage.setItem('skillName', form.value.skillName);
    sessionStorage.setItem('skillLevel', form.value.skillLevel);
    router.push({ name: 'ResumeForms', query: { step: 'final' } });
    isButtonLoading.value = false;
  }, 900);
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

  @include breakpoint(md) {
    width: 70%;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.textarea-wrapper {
  margin-top: 1.5rem;
}

.btn-row {
  margin-top: 1rem;
}

.divider {
  margin-top: 2rem;
  text-align: center;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.submit-row {
  margin-top: 2rem;
  text-align: right;
  @include flex($justify: end, $align: center);
}

.submit-btn {
  width: remify(300);
}
</style> -->

<template>
  <div class="main">
    <div class="title">مهارت‌ها</div>
    <form class="form" @submit.prevent="handleSubmit">
      <div v-for="(skill, index) in skills" :key="index" class="grid">
        <TextField label="نام مهارت" v-model="skill.skillName" />
        <Dropdown :options="dropdownItems" label="میزان تسلط" v-model="skill.skillLevel" />
        <div class="btn-row">
          <Button
            color="error"
            class="delete-button"
            type="button"
            @click="removeSkill(index)"
            v-if="skills.length > 1"
            >حذف</Button
          >
        </div>
      </div>

      <div class="btn-row">
        <Button type="button" @click="addSkill">افزودن مهارت</Button>
      </div>

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" type="submit">
          ثبت و رفتن به مرحله‌ی بعد
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import TextField from '../TextField.component.vue';
import Dropdown from '../Dropdown.component.vue';
import Button from '../Button.component.vue';

const router = useRouter();
const isButtonLoading = ref(false);
const dropdownItems = ['پایین', 'متوسط', 'خوب', 'عالی'];

// مقدار پیش‌فرض برای یک مهارت
const defaultSkill = () => ({
  skillName: '',
  skillLevel: '',
});

// تلاش برای بازیابی از sessionStorage
const loadSkillsFromSession = () => {
  const saved = sessionStorage.getItem('skills');
  try {
    return saved ? JSON.parse(saved) : [defaultSkill()];
  } catch {
    return [defaultSkill()];
  }
};

const skills = ref(loadSkillsFromSession());

// دکمه افزودن مهارت
const addSkill = () => {
  skills.value.push(defaultSkill());
};

// حذف مهارت
const removeSkill = (index) => {
  if (skills.value.length > 1) {
    skills.value.splice(index, 1);
  }
};

// وضعیت دکمه ثبت
const submitButtonConfig = reactive({
  isDisabled: computed(() => skills.value.some((s) => !s.skillName.trim() || !s.skillLevel.trim())),
  isLoading: computed(() => isButtonLoading.value),
});

// هندل سابمیت
const handleSubmit = () => {
  isButtonLoading.value = true;

  setTimeout(() => {
    // ذخیره در sessionStorage
    sessionStorage.setItem('skills', JSON.stringify(skills.value));

    router.push({ name: 'ResumeForms', query: { step: 'final' } });
    isButtonLoading.value = false;
  }, 900);
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

  @include breakpoint(md) {
    width: 70%;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.textarea-wrapper {
  margin-top: 1.5rem;
}

.btn-row {
  margin-top: 1rem;
}

.divider {
  margin-top: 2rem;
  text-align: center;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.submit-row {
  margin-top: 2rem;
  text-align: right;
  @include flex($justify: end, $align: center);
}

.submit-btn {
  width: remify(300);
}

.btn-row {
  width: 10%;
}

.delete-button {
  width: 70px;
  margin-top: -15px;
}
</style>
