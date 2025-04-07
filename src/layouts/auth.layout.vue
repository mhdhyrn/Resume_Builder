<script setup>
import Logo from '@/assets/images/logo/roomzoome-logo.svg';
</script>
<template>
  <main class="auth-layout">
    <div class="auth-layout__main main">
      <div class="main__image-container">
        <img src="@/assets/images/login-image.png" class="main__image" alt="login image" />
      </div>
      <div class="main__form">
        <div class="main__logo--header logo-container">
          <Logo class="logo-container__logo" />
          <span class="logo-container__logo-text">روم زومه</span>
        </div>
        <Transition name="fade" mode="out-in">
          <slot :key="$route.path" />
        </Transition>
        <div class="main__logo--footer logo-container">
          <Logo class="logo-container__logo" />
          <span class="logo-container__logo-text">روم زومه</span>
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

.logo-container {
  width: 100%;
  @include flex($align: center, $justify: center, $gap: space(2));

  &__logo {
    width: remify(40);
    color: color(primary);
  }

  &__logo-text {
    color: color(primary);
    @include typography('xl', 'extra-bold');
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
    padding: space(2);
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
    &--header {
      padding-top: space(10);
      @include breakpoint(md) {
        display: none;
      }
    }
    &--footer {
      padding-bottom: space(5);
      display: none;
      @include breakpoint(md) {
        display: flex;
      }
    }
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
