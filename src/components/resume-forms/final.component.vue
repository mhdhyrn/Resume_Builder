<template>
  <div class="main">
    <div class="title">دانلود رزومه</div>
    <form class="form" @submit.prevent="handleSubmit">
      رزومه شما آماده دانلود می باشد

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" type="submit">دانلود رزومه</Button>
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

const router = useRouter();
let counter = sessionStorage.getItem('counter') || 1;
const isButtonLoading = ref(false);

const submitButtonConfig = reactive({
  isLoading: computed(() => isButtonLoading.value),
});

const form = ref({
  jobPosition: '',
  company: '',
  country: 'ایران',
  state: '',
  city: '',
  startingYear: '',
  finishingYear: '',
  tasks: '',
});

const handleSubmit = () => {
  isButtonLoading.value = true;

  setTimeout(() => {
    const link = document.createElement('a');
    link.href = `/public/files/resume.pdf`;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // counter++;
    // sessionStorage.setItem('counter', counter);
    // sessionStorage.setItem('counter', counter);
    // counter++;
    isButtonLoading.value = false;
  }, 1000);
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
</style>
