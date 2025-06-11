<script setup>
import PersonalInformation from '@/components/resume-forms/personalInformation.component.vue';
import StepperComponent from '@/components/Stepper.component.vue';
import { useRoute } from 'vue-router';
import CircularProgress from '@/components/CircularProgress.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { onMounted } from 'vue';
import { getUserProfile } from '@/services/api/profile.service';
import { getUserProfile as getPersonalProfile } from '@/services/api/personal-info.service';
import { useAuthStore } from '@/stores/auth.store';

const route = useRoute();
const authStore = useAuthStore();
const progressStore = useProgressStore();
const routeLayoutName = ref('');

onMounted(async () => {
  try {
    // اول اطلاعات کاربر رو از personal-info می‌گیریم
    const personalResponse = await getPersonalProfile();
    const userId = personalResponse.data.id;

    // حالا با user_id درخواست getUserProfile رو می‌زنیم
    const response = await getUserProfile(userId);
    console.log('Profile Data:', response.data);
    progressStore.checkAllSections(response.data.resume);
  } catch (error) {
    console.error('خطا در دریافت اطلاعات پروفایل:', error);
  }
});

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
    <div class="progress-container">
      <CircularProgress :progress="progressStore.totalProgress" />
    </div>
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

.progress-container {
  display: flex;
  justify-content: center;
  padding: space(4);
  background-color: color(surface);
  border-radius: radius(lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 70%;
  margin: 0 auto;
}
</style>
