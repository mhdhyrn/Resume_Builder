<script setup>
import SvgLoader from './SvgLoader.component.vue';

const props = defineProps({
  hasTitle: {
    type: Boolean,
    default: true,
  },
  hasSubtitle: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <div class="logo-container">
    <SvgLoader name="logo" class="logo-container__logo" />
    <span v-if="hasTitle" class="logo-container__logo-text">روم زومه</span>
  </div>
</template>
<style lang="scss" scoped>
.logo-container {
  width: 100%;
  @include flex($align: center, $justify: center, $gap: space(2));

  &__logo {
    width: 30%;
    color: color(primary);
    @include breakpoint(md) {
      width: 50%;
    }
  }

  &__logo-text {
    width: 100%;
    color: color(primary);
    @include typography('xl', 'bold');

    @include breakpoint(md) {
      @include typography('xl', 'extra-bold');
    }
  }
}
</style>
