<script setup>
import BaseLogo from '@/components/BaseLogo.component.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isProfileCompletion = computed(() => route.name === 'ProfileCompletion');
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__main main">
      <div class="main__image-container">
        <img src="@/assets/images/login-image.png" class="main__image" alt="login image" />
      </div>
      <div class="main__form">
        <BaseLogo v-if="!isProfileCompletion" class="main__logo" />
        <Transition name="fade" mode="out-in">
          <slot :key="$route.path" />
        </Transition>
        <div v-if="!isProfileCompletion" class="main__footer">
          با عضویت در سایت روم زومه، تمامی
          <span class="main__rules">قوانین و مقرارت</span>
          را پذیرفته‌اید.
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.auth-layout {
  overflow-x: hidden;
  width: 100%;
  height: 100dvh;
  background-color: color(surface-container);
  @include flex($justify: center, $align: center);

  @include breakpoint(sm) {
    padding: space(5);
  }
}

.main {
  width: 100%;
  height: 100%;
  background-color: color(surface);
  @include flex($direction: column);

  @include breakpoint(sm) {
    width: 90%;
    height: 80%;
    border-radius: radius(xl);
    box-shadow: shadow(low);
    overflow: hidden;
  }

  @include breakpoint(md) {
    height: remify(670);
    width: remify(700);
    box-shadow: shadow(normal);
    @include flex($direction: row, $gap: space(2));
    padding: space(5);
  }

  @include breakpoint(lg) {
    width: remify(1000);
    height: remify(600);
  }

  @include breakpoint(xl) {
    width: remify(1200);
    height: remify(700);
  }

  &__image-container {
    @include breakpoint(lg) {
      height: 100%;
      width: 50%;
      background-color: color(surface-container-low);
      border-radius: radius(lg);
      border-top-left-radius: radius(pill);
      padding: space(5);
      @include flex($justify: center, $align: center);
    }
  }

  &__image {
    display: none;
    @include breakpoint(lg) {
      display: block;
    }
  }

  &__form {
    width: 100%;
    height: 100%;
    padding: space(6) space(2);
    background-color: color(surface);
    @include flex($direction: column, $justify: space-between, $align: center);

    @include breakpoint(md) {
      padding: 0 space(10);
    }

    @include breakpoint(lg) {
      width: 50%;
    }
  }

  &__logo {
    width: remify(120);
    padding-top: space(10);
  }

  &__footer {
    color: color(on-surface);
    @include typography('sm', 'light');
  }

  &__rules {
    text-decoration: underline;
    cursor: pointer;
    @include typography('sm', 'bold');
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: all 0.35s;
  }

  &-leave-to {
    transform: translateX(-50px);
    opacity: 0;
  }

  &-enter-from {
    transform: translateX(50px);
    opacity: 0;
  }
}
</style>
