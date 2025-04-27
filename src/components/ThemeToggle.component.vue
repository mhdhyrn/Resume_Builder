<script setup>
import { useTheme } from '@/composables';
import SvgLoader from './SvgLoader.component.vue';

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme">
    <span class="icon sun" :class="{ active: theme === 'light' }">
      <SvgLoader name="sun" />
    </span>
    <span class="icon moon" :class="{ active: theme === 'dark' }">
      <SvgLoader name="moon" />
    </span>
    <span class="slider" :class="{ 'slider--dark': theme === 'dark' }" />
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  position: relative;
  width: remify(70);
  height: remify(40);
  background: color(disabled-soft);
  border-radius: radius(pill);
  padding: 0 space(2);
  transition: background 0.3s ease;
  cursor: pointer;
  @include flex($justify: space-between, $align: center);

  @include breakpoint(md) {
    padding: 0 space(1.5);
  }
}

.icon {
  width: 20px;
  height: 20px;
  z-index: 2;
  opacity: 0.6;
  transition: opacity 0.6s ease;
  color: color(on-surface);

  @include breakpoint(md) {
    width: 25px;
    height: 25px;
  }

  &.active {
    opacity: 1;
  }
}

.slider {
  position: absolute;
  width: remify(32);
  height: remify(32);
  background: color(surface);
  border-radius: radius(pill);
  right: remify(3);
  transition: right 0.3s ease;

  &--dark {
    right: remify(35);
  }
}
</style>
