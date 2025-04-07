<script setup>
import Button from '@/components/Button.component.vue';
import TextField from '@/components/TextField.component.vue';
import { useRouter } from 'vue-router';

const { meta: formMeta } = useForm();
const router = useRouter();

const fieldsConfig = reactive({
  username: {
    modelValue: '',
    label: 'نام کاربری',
    rules: 'required',
  },
  password: {
    modelValue: '',
    type: 'password',
    label: 'گذرواژه',
    rules: 'required',
  },
});
const submitButtonConfig = reactive({
  text: 'ورود',
  isDisabled: computed(() => !formMeta.value.valid),
});

const signupButtonConfig = reactive({
  variant: 'text',
  text: 'ساخت حساب کاربری',
  color: 'secondary',
  handler: () => router.push({ name: 'Signup' }),
});
</script>

<template>
  <div class="login">
    <form class="login__form">
      <h3 class="login__title">ورود به حساب کاربری</h3>
      <div class="login__field-container">
        <TextField
          v-for="(filed, key, index) in fieldsConfig"
          :key="index"
          :name="key"
          v-bind="filed"
          class="login__field"
        />
      </div>
      <Button v-bind="submitButtonConfig" class="" />
    </form>
    <p class="login__signup-text">
      حساب کاربری ندارید؟
      <Button v-bind="signupButtonConfig" class="login__signup-button" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  @include flex($direction: column, $justify: space-between, $align: center);

  &__title {
    color: color(on-surface);
    margin-bottom: space(10);
    @include typography('2xl', 'bold');
  }

  &__form {
    height: 100%;
    width: 80%;
    @include flex($direction: column, $justify: center, $align: center, $gap: space(7));
  }

  &__field-container {
    width: 100%;
    @include flex($direction: column, $justify: center, $align: center, $gap: space(2));
  }

  &__field {
    width: 100%;
  }

  &__signup-text {
    margin-bottom: space(4);
    width: 100%;
    color: color(on-surface);
    @include typography('sm', 'light');
    @include flex($justify: center, $align: center);
  }

  &__signup-button {
    width: fit-content;
  }
}
</style>
