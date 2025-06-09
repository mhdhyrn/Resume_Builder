<script setup>
import { useRouter } from 'vue-router';
import { usePromise } from '@/composables';
import { authStore } from '@/stores';
import Button from '@/components/Button.component.vue';
import OPTInput from '@/components/OPTInput.component.vue';
import { authRoutes } from '@/constants/router';
import { notify } from '@/plugins/toast';

const router = useRouter();
const OTPCode = ref('');
const store = authStore();

const {
  execute: verifyOtp,
  loading: verifyOtpLoading,
  data: verifyOtpResponse,
  error: verifyOtpError,
} = usePromise(store.verifyOtp, { throwOnError: false });

const submitButtonConfig = reactive({
  text: 'ورود',
  type: 'submit',
  isDisabled: computed(() => OTPCode.value.trim().length < 6),

  isLoading: computed(() => verifyOtpLoading.value),
});

const formSubmission = async () => {
  const response = await verifyOtp({
    phoneNumber: store.userInfo.phoneNumber,
    otp: OTPCode.value,
  });

  if (response?.success) {
    router.push({ name: authRoutes.PROFILE_COMPLETION_NAME });
  } else {
    notify({
      message: response?.message || 'کد تایید نامعتبر است!',
      type: 'error',
    });
  }
};

const handleOtpComplete = () => {
  formSubmission();
};

onBeforeMount(() => {
  if (!store.userInfo.phoneNumber) {
    router.push({ name: authRoutes.LOGIN_NAME });
  }
});
</script>

<template>
  <div class="OTP">
    <form class="OTP__form" @submit.prevent="formSubmission">
      <h3 class="OTP__title">تایید شماره تلفن</h3>
      <div class="OTP__field-container">
        <OPTInput label="کد تایید" v-model="OTPCode" @complete="handleOtpComplete" />
      </div>
      <Button v-bind="submitButtonConfig" />
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
