<script setup>
import TheHeader from '@/components/TheHeader.component.vue';
</script>

<template>
  <main class="default-layout">
    <TheHeader />
    <div class="content">
      <slot />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.content {
  padding-top: space(19);
  min-height: 100dvh;
  background-color: color(surface-container);
  color: color(on-surface);
}
</style>
