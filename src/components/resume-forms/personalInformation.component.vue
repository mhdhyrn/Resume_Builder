<script setup>
import TextField from '../TextField.component.vue';
import TextArea from '../TextArea.component.vue';
import Button from '../Button.component.vue';
import DatePickerInput from '../DatePickerInput.component.vue';
import ImagePickerComponent from '../ImagePicker.component.vue';
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue';
import DropdownComponent from '../Dropdown.component.vue';
import { personalInfoStore } from '@/stores';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import { getAIAboutMeSuggestion } from '@/services/api/personal-info.service';

const router = useRouter();
const store = personalInfoStore();

const avatarPicture = ref(null);

const selectPictureHandler = (file) => {
  avatarPicture.value = file;
};

const removePictureHandler = () => {
  avatarPicture.value = null;
};

const formFields = ref({
  image: {
    avatar: {
      value: null,
      rules: 'required',
    },
  },
  textField: {
    firstSection: {
      firstName: {
        value: '',
        rules: 'required',
        label: 'نام',
      },
      lastName: {
        value: '',
        rules: 'required',
        label: 'نام خانوادگی',
      },
    },
    secondSection: {
      email: {
        value: '',
        rules: 'required|email',
        label: 'ایمیل',
      },
      mobile: {
        value: '',
        rules: 'required|mobileNumber',
        label: 'موبایل',
      },
      phone: {
        value: '',
        rules: '',
        label: 'تلفن',
      },
      website: {
        value: '',
        rules: '',
        label: 'وبسایت',
      },
      country: {
        value: 'ایران',
        rules: 'required',
        label: 'کشور',
      },
      province: {
        value: '',
        rules: 'required',
        label: 'استان',
      },
      city: {
        value: '',
        rules: 'required',
        label: 'شهر',
      },
      address: {
        value: '',
        rules: 'required',
        label: 'آدرس',
      },
    },
  },
  datePicker: {
    birthDate: {
      value: '',
      rules: 'required',
      label: 'تاریخ تولد',
    },
  },
  textArea: {
    aboutMe: {
      value: '',
      rules: '',
      label: 'درباره من',
    },
  },
  select: {
    militaryServiceStatus: {
      value: '',
      rules: 'required',
      label: 'وضعیت نظام وظیفه',
      options: [
        { label: 'درحال انجام', value: 'ongoing' },
        { label: 'انجام نشده', value: 'not_applicable' },
        { label: 'معاف', value: 'exempted' },
        { label: 'پایان خدمت', value: 'completed' },
      ],
    },
    gender: {
      value: '',
      rules: 'required',
      label: 'جنسیت',
      options: [
        { label: 'زن', value: 'female' },
        { label: 'مرد', value: 'male' },
      ],
    },
    maritalStatus: {
      value: '',
      rules: 'required',
      label: 'وضعیت تاهل',
      options: [
        { label: 'مجرد', value: false },
        { label: 'متاهل', value: true },
      ],
    },
  },
});

const isButtonLoading = ref(false);
const isFormFilled = computed(() => {
  const checkFields = (obj) => {
    return Object.values(obj).every((field) => {
      if (field && typeof field === 'object' && 'value' in field && 'rules' in field) {
        return field.rules !== '' ? field.value !== '' : true;
      } else if (typeof field === 'object') {
        return checkFields(field);
      }
      return true;
    });
  };

  const isAvatarUploaded = formFields.value.image.avatar.value !== null;
  return checkFields(formFields.value) && isAvatarUploaded;
});

const submitButtonConfig = reactive({
  text: 'ثبت و رفتن به مرحله ی بعد',
  isDisabled: computed(() => {
    const isAvatarUploaded = formFields.value.image.avatar.value !== null;
    return !(isFormFilled.value && isAvatarUploaded);
  }),
  isLoading: computed(() => !!isButtonLoading.value),
});

const isLoading = ref(true);
const baseURL = 'http://37.32.24.212:8000';

// Helper function to get full image URL
const getFullImageUrl = (path) => {
  if (!path) return null;
  return `${baseURL}${path}`;
};

// Helper function to find label by value
const findLabelByValue = (options, value) => {
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : value;
};

// Computed properties for dropdown labels
const genderLabel = computed(() =>
  findLabelByValue(formFields.value.select.gender.options, store.personalInfo?.gender),
);

const maritalStatusLabel = computed(() =>
  findLabelByValue(formFields.value.select.maritalStatus.options, store.personalInfo?.isMarried),
);

const militaryServiceStatusLabel = computed(() =>
  findLabelByValue(
    formFields.value.select.militaryServiceStatus.options,
    store.personalInfo?.militaryServiceStatus,
  ),
);

onMounted(async () => {
  try {
    await store.fetchAllData();

    // Fill profile info data
    formFields.value.textField.firstSection.firstName.value = store.profileInfo.firstName;
    formFields.value.textField.firstSection.lastName.value = store.profileInfo.lastName;
    formFields.value.datePicker.birthDate.value = store.profileInfo.birthDate;

    // Handle profile picture
    if (store.profileInfo.profilePicture) {
      formFields.value.image.avatar.value = {
        url: getFullImageUrl(store.profileInfo.profilePicture),
        path: store.profileInfo.profilePicture,
      };
    }

    // Fill personal info data
    formFields.value.select.gender.value = store.personalInfo.gender;
    formFields.value.select.maritalStatus.value = store.personalInfo.isMarried;
    formFields.value.select.militaryServiceStatus.value = store.personalInfo.militaryServiceStatus;
    formFields.value.textArea.aboutMe.value = store.personalInfo.aboutMe;

    // Fill contact info data
    formFields.value.textField.secondSection.email.value = store.contactInfo.email;
    formFields.value.textField.secondSection.mobile.value = store.contactInfo.phoneNumber;
    formFields.value.textField.secondSection.phone.value = store.contactInfo.landline;
    formFields.value.textField.secondSection.website.value = store.contactInfo.website;
    formFields.value.textField.secondSection.country.value = store.contactInfo.country;
    formFields.value.textField.secondSection.province.value = store.contactInfo.province;
    formFields.value.textField.secondSection.city.value = store.contactInfo.city;
    formFields.value.textField.secondSection.address.value = store.contactInfo.address;
  } catch (error) {
    notify({
      message: 'خطا در دریافت اطلاعات',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    isButtonLoading.value = true;

    // Update personal info
    await store.updatePersonalInfo({
      gender: formFields.value.select.gender.value,
      isMarried: formFields.value.select.maritalStatus.value,
      militaryServiceStatus: formFields.value.select.militaryServiceStatus.value,
      aboutMe: formFields.value.textArea.aboutMe.value,
    });

    // Update contact info
    await store.updateContactInfo({
      phoneNumber: formFields.value.textField.secondSection.mobile.value,
      email: formFields.value.textField.secondSection.email.value,
      landline: formFields.value.textField.secondSection.phone.value,
      website: formFields.value.textField.secondSection.website.value,
      country: formFields.value.textField.secondSection.country.value,
      province: formFields.value.textField.secondSection.province.value,
      city: formFields.value.textField.secondSection.city.value,
      address: formFields.value.textField.secondSection.address.value,
    });

    // Update profile info - only send profilePicture if it's a new file
    const profileData = {
      firstName: formFields.value.textField.firstSection.firstName.value,
      lastName: formFields.value.textField.firstSection.lastName.value,
      birthDate: formFields.value.datePicker.birthDate.value,
    };

    // Only add profilePicture if it's a new File object
    if (formFields.value.image.avatar.value?.file instanceof File) {
      profileData.profilePicture = formFields.value.image.avatar.value.file;
    }

    await store.updateProfileInfo(profileData);

    notify({
      message: 'اطلاعات با موفقیت ذخیره شد',
      type: 'success',
    });

    router.push({ name: 'ResumeForms', query: { step: 'educationalRecords' } });
  } catch (error) {
    notify({
      message: error.message || 'خطا در ذخیره اطلاعات',
      type: 'error',
    });
  } finally {
    isButtonLoading.value = false;
  }
};

const isAILoading = ref(false);

const getAISuggestion = async () => {
  try {
    isAILoading.value = true;
    const response = await getAIAboutMeSuggestion(formFields.value.textArea.aboutMe.value);
    console.log('AI Response:', response);

    // اگر response.data یک string نیست، احتمالاً در یک فیلد دیگه قرار داره
    const suggestion = response.data?.suggestion || response.data?.text || response.data;

    if (typeof suggestion === 'string') {
      formFields.value.textArea.aboutMe.value = suggestion.replace(/\\n/g, '\n');
    } else {
      throw new Error('فرمت پاسخ دریافتی نامعتبر است');
    }
  } catch (error) {
    notify({
      message: error.message || 'خطا در دریافت پیشنهاد',
      type: 'error',
    });
  } finally {
    isAILoading.value = false;
  }
};

// computed برای کنترل disabled بودن دکمه
const isAIButtonDisabled = computed(() => {
  return !formFields.value.textArea.aboutMe.value || isAILoading.value;
});
</script>

<template>
  <div class="main">
    <div class="loading-container" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div class="title">اطلاعات شخصی</div>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="form-container">
          <ImagePickerComponent
            :value="formFields.image.avatar.value"
            @select="(file) => (formFields.image.avatar.value = file)"
            @remove="() => (formFields.image.avatar.value = null)"
          />
          <div class="grid">
            <TextField
              v-for="(field, index) in formFields.textField.firstSection"
              :key="index"
              v-bind="field"
              v-model="field.value"
            />
            <DropdownComponent
              v-for="(field, index) in formFields.select"
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
        </div>

        <hr />

        <div class="grid2">
          <TextField
            v-for="(field, index) in formFields.textField.secondSection"
            :key="index"
            v-bind="field"
            v-model="field.value"
          />
        </div>

        <hr />

        <TextArea
          v-for="(field, index) in formFields.textArea"
          :key="index"
          v-bind="field"
          v-model="field.value"
        >
        </TextArea>
        <div class="ai-section">
          <button
            class="ai-button"
            :disabled="isAIButtonDisabled"
            :class="{ 'is-loading': isAILoading }"
            @click="getAISuggestion"
          >
            <span v-if="!isAILoading">پیشنهاد هوش مصنوعی</span>
            <span v-else>در حال دریافت پیشنهاد...</span>
          </button>
          <p class="ai-hint">برای گرفتن پیشنهاد از هوش مصنوعی، کلید واژه‌های مهم خود را بنویسید.</p>
        </div>

        <div class="submit-row">
          <Button class="submit-btn" v-bind="submitButtonConfig" type="submit" />
        </div>
      </form>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  width: 70%;
  height: 100%;
}
hr {
  margin: 30px 0;
  color: color(disabled-soft);
}

.main {
  width: 100%;
  position: relative;
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

.form-container {
  width: 100%;
  @include flex($direction: column, $align: center, $justify: center, $gap: space(5));

  @include breakpoint(md) {
    @include flex($align: center, $justify: center, $gap: space(5));
  }
}

.grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;

  @include breakpoint(md) {
    width: calc(100% - 250px);
  }
}

.grid2 {
  width: 100%;
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

.ai-section {
  margin-top: space(2);
  display: flex;
  flex-direction: column;
  gap: space(2);
}

.ai-button {
  align-self: flex-start;
  padding: space(2) space(4);
  background-color: color(secondary);
  color: color(on-secondary);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.is-loading {
    opacity: 0.5;
    cursor: wait;
  }
}

.ai-hint {
  color: color(on-surface-variant);
  @include typography(sm);
}
</style>
