<script setup>
import Button from '@/components/Button.component.vue';
import TextField from '@/components/TextField.component.vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores';
import { usePromise } from '@/composables';
import { notify } from '@/plugins/toast';

const { meta: formMeta } = useForm();
const router = useRouter();

const fieldsConfig = reactive({
  phoneNumber: {
    // modelValue: '',
    label: 'شماره موبایل',
    rules: 'required|mobileNumber',
    prependIcon: 'smart-phone',
  },
});
const submitButtonConfig = reactive({
  text: 'ورود',
  isDisabled: computed(() => !formMeta.value.valid),
  isLoading: computed(() => isLoginBtnLoading.value),
  type: 'submit',
});

const test = ref('');

const {
  execute: verifyUser,
  loading: isLoginBtnLoading,
  data: response,
} = usePromise(authStore.verifyUser);

const formSubmission = () => {
  // const payload = {
  //   phoneNumber: fieldsConfig.phoneNumber.modelValue,
  //   password: fieldsConfig.password.modelValue,
  // };
  // verifyUser(payload);
  isLoginBtnLoading.value = true;
  setTimeout(() => {
    isLoginBtnLoading.value = false;
    // authStore().userInfo.phoneNumber = fieldsConfig.phoneNumber.modelValue;
    sessionStorage.setItem('phoneNumber', test.value);
    notify({ message: `کد تایید به شماره فلان ارسال شد`, type: 'success'});
    router.push({ name: 'OTP' });
  }, 300);
};
</script>
<template>
  <div class="login">
    <form class="login__form" @submit.prevent="formSubmission">
      <h3 class="login__title">ورود به حساب کاربری</h3>
      <div class="login__field-container">
        <TextField
          v-for="(filed, key, index) in fieldsConfig"
          :key="index"
          :name="key"
          v-bind="filed"
          v-model="test"
          class="login__field"
        />
      </div>
      <Button v-bind="submitButtonConfig" class="" />
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
