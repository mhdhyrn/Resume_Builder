<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import TextField from '@/components/TextField.component.vue';
import Button from '@/components/Button.component.vue';
import { useAdminAuthStore } from '@/stores/admin-auth.store';
import { notify } from '@/plugins/toast';
import { adminRoutes } from '@/constants/router';
import { usePromise } from '@/composables';
import { useForm } from 'vee-validate';

const router = useRouter();
const store = useAdminAuthStore();
const { meta: formMeta } = useForm();

const formData = reactive({
  username: '',
  password: '',
});

const { execute: verifyUser, loading: isSubmitLoading } = usePromise(store.login);

const fieldsConfig = {
  username: {
    label: 'نام کاربری',
    rules: 'required',
  },
  password: {
    label: 'رمز عبور',
    rules: 'required',
  },
};

const submitButtonConfig = reactive({
  text: 'ورود',
  type: 'submit',
  isLoading: computed(() => isSubmitLoading.value),
  isDisabled: computed(() => !formMeta.value.valid),
});

const isValid = computed(() => form.username.trim() && form.password.trim());

const handleSubmit = async () => {
  try {
    const res = await verifyUser({ username: formData.username, password: formData.password });
    if (res?.status === 200) {
      notify({ message: 'ورود ادمین موفقیت‌آمیز بود', type: 'success' });
      router.push({ name: adminRoutes.DASHBOARD_NAME });
    } else {
      notify({ message: 'رمز عبور یا نام کاربری اشتباه است!', type: 'error' });
    }
  } catch (error) {
    notify({ message: error, type: 'success' });
  }
};
</script>

<template>
  <div class="login">
    <form class="login__form" @submit.prevent="handleSubmit">
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
