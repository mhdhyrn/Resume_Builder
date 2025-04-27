<script setup>
import Layout from '@/layouts/layout.vue';
import ToastContainer from '@/components/ToastContainer.component.vue';
import { useTheme } from '@/composables';

useTheme();
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
  <ToastContainer />
</template>

<style lang="scss" scoped></style>
