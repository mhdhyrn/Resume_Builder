<script setup>
import { getCssVariable } from '@/utils/';
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker';
import moment from 'moment-jalaali';
import TextField from './TextField.component.vue';

const modelValue = defineModel();

const props = defineProps({
  min: {
    default: '',
  },
  max: {
    default: moment().locale('fa').format(persianDateFormat),
  },
  label: {
    type: String,
    default: 'تاریخ',
  },
});

const datePickerColor = getCssVariable('--primary');
const persianDateFormat = 'jYYYY/jMM/jDD';
const isDatePickerVisible = ref(false);
const toggleDatePickerVisibility = () => (isDatePickerVisible.value = !isDatePickerVisible.value);

const updateActiveFilterField = (date) => {
  const formattedDate = moment(date).format(persianDateFormat);
  modelValue.value = formattedDate;
};
</script>
<template>
  <div class="list">
    <TextField
      prepend-icon="calendar"
      :readonly="true"
      v-model="modelValue"
      :label="label"
      @click="toggleDatePickerVisibility"
      class="list__filter-input"
      name="datePickerInput"
    />
    <Vue3PersianDatetimePicker
      :display-format="persianDateFormat"
      :show="isDatePickerVisible"
      :color="datePickerColor"
      :auto-submit="true"
      :max="max"
      :min="min"
      view="year"
      :editable="false"
      custom-input="datePickerInput"
      @close="toggleDatePickerVisibility"
      @change="updateActiveFilterField"
    />
  </div>
</template>
<style lang="scss">
.disable {
  display: none;
}
</style>
