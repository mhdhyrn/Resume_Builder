<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const routeLayoutName = ref('default');

const onRouteChange = () => {
  routeLayoutName.value = route.meta?.layout ?? 'default';
};

watch(() => route?.meta?.layout, onRouteChange, {
  immediate: true,
});

const layout = computed(() => {
  const layoutName = routeLayoutName.value;
  return defineAsyncComponent(() => import(`@/layouts/${layoutName}.layout.vue`));
});
</script>

<template>
  <component :is="layout">
    <slot />
  </component>
</template>
