<script setup>
import Button from '@/components/Button.component.vue';

const headerButtonConfigs = reactive([
  {
    text: 'ساخت رزومه',
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
      <div class="header__content">
        <h1 class="header__title">رزومه حرفه‌ای خودتو سریع بساز</h1>
        <p class="header__subtitle">
          با رزومه‌ساز آنلاین ما، تنها در چند دقیقه یک رزومه جذاب و حرفه‌ای بساز.
        </p>
        <div class="header__btn-container">
          <Button
            v-for="(item, index) in headerButtonConfigs"
            :key="index"
            v-bind="item"
            class="header__btn"
          />
        </div>
      </div>
      <div class="header__image-wrapper">
        <img src="#" alt="تصویر هدر" class="header__image" />
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100dvh;
  padding: space(3) 0;
  background-color: color(surface);
  color: color(on-surface);

  @include breakpoint(md) {
    padding: space(5);
  }
}

.header {
  padding: space(5) space(2);
  @include flex($direction: row-reverse, $align: center, $justify: space-between);

  &__content {
    flex: 1;
    padding: space(2);
  }

  &__title {
    margin-bottom: space(2);
    @include typography('xl', 'bold');
  }

  &__subtitle {
    margin-bottom: space(2);
    color: color(outline-variant);
    @include typography('lg', 'medium');
  }

  &__btn-container {
    @include flex($justify: center, $wrap: wrap, $gap: space(2));
  }

  &__image-wrapper {
    flex: 1;
    text-align: center;
  }

  &__image {
    max-width: 100%;
    height: auto;
  }

  @include breakpoint(md) {
    flex-direction: column-reverse;
    text-align: center;
    @include flex($direction: column-reverse);
  }
}
</style>
