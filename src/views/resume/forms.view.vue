<script setup>
import PersonalInformation from '@/components/resume-forms/personalInformation.component.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const templateId = route.params.templateId;


</script>
<template>
  <div>
    salam
    <PersonalInformation />
  </div>
</template>
<style lang="scss" scoped></style>
