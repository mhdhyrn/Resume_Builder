<script setup>
import Layout from '@/layouts/layout.vue';
import ToastContainer from '@/components/ToastContainer.component.vue';
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
  <ToastContainer />
</template>

<style lang="scss" scoped></style>
