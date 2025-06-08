<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/Button.component.vue';
import TextField from '@/components/TextField.component.vue';
import { authStore } from '@/stores';
import { usePromise } from '@/composables';
import { notify } from '@/plugins/toast';
import { authRoutes } from '@/constants/router';

const router = useRouter();
const store = authStore();
const { meta: formMeta } = useForm();

const formData = reactive({
  phoneNumber: '',
});

const fieldsConfig = {
  phoneNumber: {
    label: 'شماره موبایل',
    rules: 'required|mobileNumber',
    prependIcon: 'smart-phone',
  },
};

const {
  execute: verifyUser,
  loading: isVerifyUserLoading,
  data: verifyUserResponse,
} = usePromise(store.verifyUser);

const submitButtonConfig = reactive({
  text: 'ورود',
  type: 'submit',
  isLoading: computed(() => isVerifyUserLoading.value),
  isDisabled: computed(() => !formMeta.value.valid),
});

const formSubmission = async () => {
  await verifyUser({ phoneNumber: formData.phoneNumber });
  console.log(verifyUserResponse.value);

  notify({
    message: `کد به شماره ${store.userInfo.phoneNumber} ارسال شد! کد تایید : ${verifyUserResponse.value.data.otp}`,
    duration: 5000,
  });
  router.push({ name: authRoutes.OTP_NAME });
};
</script>

<template>
  <div class="login">
    <form class="login__form" @submit.prevent="formSubmission">
      <h3 class="login__title">ورود به حساب کاربری</h3>

      <div class="login__field-container">
        <TextField
          v-for="(config, key) in fieldsConfig"
          :key="key"
          v-model="formData[key]"
          :name="key"
          v-bind="config"
          class="login__field"
        />
      </div>

      <Button v-bind="submitButtonConfig" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
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
