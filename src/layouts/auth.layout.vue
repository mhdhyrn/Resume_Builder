<script setup></script>
<template>
  <main class="auth-layout">
    <div class="auth-layout__main main">
      <div class="main__image"></div>
      <div class="main__form">
        <slot />
      </div>
    </div>
  </main>
</template>
<style lang="scss" scoped>
.auth-layout {
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
    height: remify(600);
    width: remify(700);
    box-shadow: shadow(normal);
  }

  @include breakpoint(lg) {
    width: remify(1000);
    height: remify(600);
    @include flex($direction: row, $gap: space(2));
  }

  @include breakpoint(xl) {
    width: remify(1200);
    height: remify(700);
  }

  &__image {
    position: relative;
    top: 0;
    border-bottom-right-radius: 100%;
    border-bottom-left-radius: 100%;
    width: 100%;
    height: remify(350);
    background-color: color(primary);

    @include breakpoint(lg) {
      display: block;
    }
  }

  &__form {
    width: 100%;
    height: 100%;

    @include breakpoint(lg) {
      width: 50%;
    }
  }
}
</style>
