<script setup>
import Layout from '@/layouts/layout.vue';
import ToastContainer from '@/components/ToastContainer.component.vue';
import AuthModal from '@/components/AuthModal.component.vue';
import { useTheme } from '@/composables';
import { modalStore } from '@/stores';

const store = modalStore();
useTheme();
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
  <ToastContainer />
  <AuthModal :is-open="store.isAuthModalOpen" @close="store.closeAuthModal" />
</template>

<style lang="scss" scoped></style>
