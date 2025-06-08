<script setup>
import PersonalInformation from '@/components/resume-forms/personalInformation.component.vue';
import StepperComponent from '@/components/Stepper.component.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeLayoutName = ref('');

const onRouteChange = () => {
  routeLayoutName.value = route?.query?.step ?? '';
};

watch(() => route?.query?.step, onRouteChange, {
  immediate: true,
});

const layout = computed(() => {
  if (routeLayoutName.value) {
    const layoutName = routeLayoutName.value;
    return defineAsyncComponent(
      () => import(`@/components/resume-forms/${layoutName}.component.vue`),
    );
  }
});
</script>
<template>
  <div class="forms">
    <StepperComponent class="stepper" />
    <transition name="fade" mode="out-in">
      <component :is="layout" />
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.forms {
  min-height: 100dvh;
  overflow-x: hidden;
  padding: space(10) 0;
  @include flex($direction: column, $justify: start, $align: center, $gap: space(7));
}

.stepper {
  width: 70%;
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: all 0.35s;
  }

  &-leave-to {
    transform: translateX(-50px);
    opacity: 0;
  }

  &-enter-from {
    transform: translateX(50px);
    opacity: 0;
  }
}
</style>
