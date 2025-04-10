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
  padding-top: space(16);
  min-height: 100dvh;
}
</style>
