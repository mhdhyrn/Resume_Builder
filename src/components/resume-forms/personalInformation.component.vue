<script setup>
import TextField from '../TextField.component.vue';
import TextArea from '../TextArea.component.vue';
import Button from '../Button.component.vue';
import DatePickerInput from '../DatePickerInput.component.vue';
import ImagePickerComponent from '../ImagePicker.component.vue';
import { useRouter } from 'vue-router';
import { ref, reactive, computed } from 'vue';
import DropdownComponent from '../Dropdown.component.vue';
import { personalInfoStore } from '@/stores';
import { notify } from '@/plugins/toast';

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
      resumeLabel: {
        value: '',
        rules: 'required',
        label: 'عنوان رزومه',
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

    // Update profile info
    await store.updateProfileInfo({
      firstName: formFields.value.textField.firstSection.firstName.value,
      lastName: formFields.value.textField.firstSection.lastName.value,
      birthDate: formFields.value.datePicker.birthDate.value,
      profilePicture: formFields.value.image.avatar.value,
    });

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
</script>

<template>
  <div class="main">
    <div class="title">اطلاعات شخصی</div>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-container">
        <ImagePickerComponent
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
      />

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" type="submit" />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
hr {
  margin: 30px 0;
  color: color(disabled-soft);
}

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
</style>
