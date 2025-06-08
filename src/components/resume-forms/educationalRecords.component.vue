<script setup>
import TextField from '../TextField.component.vue';
import TextArea from '../TextArea.component.vue';
import Button from '../Button.component.vue';
import DatePickerInput from '../DatePickerInput.component.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isButtonLoading = ref(false);

const submitButtonConfig = reactive({
  text: 'ثبت و رفتن به مرحله ی بعد',
  isDisabled: computed(() => {
    const isFilled = Object.values(formFields.value).every((fields) =>
      Object.values(fields).every((field) => (field.rules !== '' ? field.value !== '' : true)),
    );
    return !isFilled;
  }),
  isLoading: computed(() => !!isButtonLoading.value),
});

const formFields = ref({
  datePicker: {
    startingYear: {
      value: '',
      rules: 'required',
      label: 'تاریخ شروع',
    },
    finishingYear: {
      value: '',
      rules: 'required',
      label: 'تاریخ پایان',
    },
  },
  textArea: {
    description: {
      value: '',
      rules: '',
      label: 'شرح بیشتر',
    },
  },
  textField: {
    level: {
      value: '',
      rules: 'required',
      label: 'سطح',
    },
    fieldOfStudy: {
      value: '',
      rules: 'required',
      label: 'حوزه تحصیل',
    },
    branch: {
      value: '',
      rules: 'required',
      label: 'شاخه',
    },
    educationInstituteTitle: {
      value: '',
      rules: 'required',
      label: 'نام مرکز تحصیلی',
    },
    average: {
      value: '',
      rules: 'required',
      label: 'معدل',
    },
    country: {
      value: 'ایران',
      rules: 'required',
      label: 'کشور',
    },
    city: {
      value: '',
      rules: 'required',
      label: 'شهر',
    },
    state: {
      value: '',
      rules: 'required',
      label: 'استان',
    },
  },
});

const handleSubmit = () => {
  isButtonLoading.value = true;
  setTimeout(() => {
    router.push({ name: 'ResumeForms', query: { step: 'experienceRecords' } });
    isButtonLoading.value = false;
  }, 1400);
};
</script>

<template>
  <div class="main">
    <div class="title">سوابق تحصیلی</div>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="grid">
        <TextField
          v-for="(field, index) in formFields.textField"
          :key="index"
          v-bind="field"
          v-model="field.value"
        />
        <DatePickerInput
          v-for="(field, index) in formFields.datePicker"
          :key="index"
          v-bind="field"
          v-model="field.value"
        />
      </div>

      <div class="textarea-wrapper">
        <TextArea
          v-for="(field, index) in formFields.textArea"
          :key="index"
          v-bind="field"
          v-model="field.value"
        />
      </div>

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" type="submit" />
      </div>
    </form>
  </div>
</template>

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
</style>
