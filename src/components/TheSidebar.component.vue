<script setup>
import BaseLogo from './BaseLogo.component.vue';

const props = defineProps({
  items: Array,
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const emitClose = () => emit('close');
</script>

<template>
  <div class="backdrop" @click="emitClose" v-if="isOpen" />
  <aside class="the-sidebar" :class="{ 'is-open': isOpen }">
    <div class="the-sidebar__header">
      <BaseLogo class="the-sidebar__logo" />
      <button class="the-sidebar__close" @click="emitClose">×</button>
    </div>
    <nav>
      <ul class="the-sidebar__items-container">
        <li v-for="item in items" :key="item.name">
          <RouterLink :to="item.href" @click="emitClose" class="the-sidebar__items">{{
            item.name
          }}</RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: color(disabled-soft);
  opacity: 0.7;
  z-index: 99;
}

.the-sidebar {
  position: fixed;
  top: 0;
  right: remify(-300);
  width: remify(270);
  height: 100vh;
  background: color(surface);
  box-shadow: shadow('high');
  padding: space(6) space(6);
  transition: right 0.3s ease;
  z-index: 100;

  &.is-open {
    right: 0;
  }

  &__header {
    @include flex($align: center, $justify: space-between);
  }

  &__logo {
    width: remify(120);
  }

  &__close {
    color: color(on-surface);
    @include typography('5xl', 'light');
  }

  &__items-container {
    margin-top: space(10);
    @include flex($direction: column, $gap: space(5));
  }

  &__items {
    color: color(on-surface);
    @include typography('md', 'medium');
  }
}
</style>
