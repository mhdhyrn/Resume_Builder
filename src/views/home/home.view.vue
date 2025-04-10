<script setup>
import Button from '@/components/Button.component.vue';

const headerButtonConfigs = reactive([
  {
    text: 'ساختن روزمه حرفه‌ای',
    // TODO: set handler
  },
  {
    text: 'دیدن نمونه‌ها',
    variant: 'outline',
    color: 'secondary',
    // TODO: set handler
  },
]);
</script>
<template>
  <div class="home">
    <header class="home__header header">
      <div class="header__image-wrapper">
        <img src="@/assets/images/home/header-image.png" alt="تصویر هدر" class="header__image" />
      </div>
      <div class="header__content">
        <h1 class="header__title">با روم زومه، همه‌ی نگاه‌ها روت زومه!</h1>
        <p class="header__subtext">
          در کمتر از 10 دقیقه رزومه‌ی حرفه‌ای خودت رو بساز و همه‌ی شرکت هارو جذب خودت کن
        </p>
        <div v-if="!isUserLogin" class="header__btn-container">
          <Button
            v-for="(item, index) in headerButtonConfigs"
            :key="index"
            v-bind="item"
            class="header__btn"
          />
        </div>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100dvh;
  background-color: color(surface-container);
  color: color(on-surface);

  @include breakpoint(md) {
    padding: space(5);
  }
}

.header {
  padding: 0 space(2);
  @include flex($direction: column, $align: center, $justify: space-between);

  &__content {
    flex: 1;
    padding: space(2);
    @include flex($direction: column, $justify: center, $align: center);
  }

  &__title {
    text-align: center;
    margin-bottom: space(2);
    @include typography('4xl', 'extra-bold');
  }

  &__subtitle {
    text-align: center;
    margin-bottom: space(2);
    color: color(disabled-hard);
    @include typography('2xl', 'bold');
  }

  &__subtext {
    text-align: center;
    margin-bottom: space(10);
    color: color(outline);
    @include typography('lg', 'medium');
  }

  &__btn-container {
    width: 100%;
    @include flex($justify: center, $gap: space(2));
  }

  &__btn {
    width: 45%;
    @include breakpoint(lg) {
      width: 25%;
    }
  }

  &__image-wrapper {
    width: 100%;

    @include breakpoint(md) {
      width: 65%;
    }

    @include breakpoint(lg) {
      width: 55%;
    }
  }

  &__image {
    width: 100%;
    height: auto;
  }

  @include breakpoint(md) {
    text-align: center;
    @include flex($direction: row);
  }
}
</style>
