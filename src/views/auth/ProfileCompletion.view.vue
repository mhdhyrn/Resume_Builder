<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/Button.component.vue';
import TextField from '@/components/TextField.component.vue';
import DatePickerInput from '@/components/DatePickerInput.component.vue';
import ImagePickerComponent from '@/components/ImagePicker.component.vue';
import { useAuthStore } from '@/stores/auth.store';
import { usePromise } from '@/composables';
import { notify } from '@/plugins/toast';
import { authRoutes, homeRoutes } from '@/constants/router';
import { ref, reactive, computed, onBeforeMount } from 'vue';

const router = useRouter();
const store = useAuthStore();

const formData = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  profilePicture: null,
});

const fieldsConfig = {
  firstName: {
    label: 'نام',
    rules: 'required',
  },
  lastName: {
    label: 'نام خانوادگی',
    rules: 'required',
  },
  birthDate: {
    label: 'تاریخ تولد',
    rules: 'required',
  },
};

const isFormValid = computed(() => {
  return (
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.birthDate &&
    formData.profilePicture
  );
});

const { execute: updateProfile, loading: isUpdating } = usePromise(store.updateProfile);

const submitButtonConfig = reactive({
  text: 'تکمیل پروفایل',
  type: 'submit',
  isLoading: computed(() => isUpdating.value),
  isDisabled: computed(() => !isFormValid.value),
});

const formSubmission = async () => {
  const response = await updateProfile({
    firstName: formData.firstName,
    lastName: formData.lastName,
    birthDate: formData.birthDate,
    profilePicture: formData.profilePicture,
  });
  if (response?.status === 200) {
    notify({ message: 'پروفایل با موفقیت تکمیل شد', type: 'success' });
    router.push({ name: homeRoutes.HOME_NAME });
  } else {
    notify({ message: response?.message || 'خطا در تکمیل پروفایل', type: 'error' });
  }
};

onBeforeMount(() => {
  // اگر اطلاعات پروفایل ناقص بود، کاربر باید این فرم را پر کند
  const info = store.userInfo;
  if (!info.firstName || !info.lastName || !info.birthDate || !info.profilePicture) {
    // stay here
  } else {
    router.push({ name: homeRoutes.HOME_NAME });
  }
});
</script>

<template>
  <div class="profile-completion">
    <form class="profile-completion__form" @submit.prevent="formSubmission">
      <h3 class="profile-completion__title">تکمیل پروفایل</h3>
      <div class="profile-completion__field-container">
        <TextField
          v-for="key in ['firstName', 'lastName']"
          :key="key"
          v-model="formData[key]"
          :name="key"
          v-bind="fieldsConfig[key]"
          class="profile-completion__field"
        />
        <DatePickerInput
          v-model="formData.birthDate"
          :label="fieldsConfig.birthDate.label"
          class="profile-completion__field"
        />
        <ImagePickerComponent
          @select="(file) => (formData.profilePicture = file)"
          @remove="() => (formData.profilePicture = null)"
        />
      </div>
      <Button v-bind="submitButtonConfig" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.profile-completion {
  width: 100%;
  height: 100%;
  @include flex($direction: column, $justify: space-between, $align: center);

  &__title {
    color: color(on-surface);
    margin-bottom: space(2);
    @include typography('xl', 'bold');
  }

  &__form {
    height: 100%;
    width: 80%;
    @include flex($direction: column, $justify: center, $align: center, $gap: space(7));
  }

  &__field-container {
    width: 100%;
    @include flex($direction: column, $justify: center, $align: center);
  }

  &__field {
    width: 100%;
  }
}
</style>
