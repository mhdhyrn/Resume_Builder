<script setup>
import Button from '@/components/Button.component.vue';
import TextField from '@/components/TextField.component.vue';
import OPTInput from '@/components/OPTInput.component.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { toast } from '@/libs';
import { authStore } from '@/stores';
import { usePromise } from '@/composables';

const { meta: formMeta } = useForm();
const router = useRouter();

const OTPCode = ref('');

const OTPButtonConfig = reactive({
  variant: 'text',
  text: 'ورود به حساب کاربری',
  color: 'secondary',
  handler: () => router.push({ name: 'Login' }),
});

const submitButtonConfig = reactive({
  text: 'ورود',
  isDisabled: computed(() => !formMeta.value.valid),
  isLoading: computed(() => isLoginBtnLoading.value),
  type: 'submit',
});

const {
  execute: verifyUser,
  loading: isLoginBtnLoading,
  data: response,
} = usePromise(authStore.verifyUser);

onMounted(() => {
  toast.success(`کد تایید به شماره ${sessionStorage.getItem('phoneNumber')} ارسال شد.`);
});

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
    sessionStorage.setItem('isUserLogin', true);
    router.push({ name: 'Home' });
  }, 500);
};
</script>

<template>
  <div class="OTP">
    <form class="OTP__form" @submit.prevent="formSubmission">
      <h3 class="OTP__title">تایید شماره تلفن</h3>
      <div class="OTP__field-container">
        <OPTInput label="کد تایید" v-model="OTPCode" @complete="formSubmission" />
      </div>
      <Button v-bind="submitButtonConfig" class="" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.OTP {
  width: 100%;
  height: 100%;
  @include flex($direction: column, $justify: space-between, $align: center);

  &__title {
    color: color(on-surface);
    margin-bottom: space(2);
    @include typography('2xl', 'bold');
  }

  &__form {
    height: 100%;
    width: 80%;
    @include flex($direction: column, $justify: center, $align: center, $gap: space(7));
  }
}
</style>
