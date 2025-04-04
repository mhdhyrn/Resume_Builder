<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    default: 'svg',
  },
});

const loadIcon = computed(() => {
  if (props.name) {
    try {
      return defineAsyncComponent(() => import(`@/assets/icons/${props.name}.${props.suffix}`));
    } catch (error) {
      console.error(error);
      return '';
    }
  }
});
</script>
<template>
  <component v-if="name" :is="loadIcon" />
</template>
<style lang="scss" scoped></style>
