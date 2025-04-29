<script setup>
import Dropdown from '@/components/Dropdown.component.vue';
import { ref } from 'vue';
import TextArea from '../TextArea.component.vue';
import DatePickerInputComponent from '../DatePickerInput.component.vue';

const selectedOption = ref(null);
const options = [
  { value: 1, label: 'گزینه اول' },
  { value: 2, label: 'گزینه دوم' },
  { value: 3, label: 'گزینه سوم' },
];
</script>
<template>
  <pre>{{ selectedOption }}</pre>
  <TextArea v-model="selectedOption" label="جنسیت" />
  <DatePickerInputComponent />
</template>
