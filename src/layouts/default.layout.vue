<script setup>
import TheHeader from '@/components/TheHeader.component.vue';
</script>

<template>
  <main class="default-layout">
    <TheHeader />
    <slot />
  </main>
</template>

<style lang="scss" scoped></style>
