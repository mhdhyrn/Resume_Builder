<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { stepItems } from '@/constants';
import Dropdown from './Dropdown.component.vue';

const router = useRouter();
const route = useRoute();
const activeStep = ref(0);
const isMobileListOpen = ref(false);

// بر اساس route.query مقدار activeStep را تعیین کن
const setActiveStepFromRoute = () => {
  const stepFromRoute = route.query.step;
  const foundIndex = stepItems.findIndex((step) => step.name === stepFromRoute);
  activeStep.value = foundIndex !== -1 ? foundIndex : 0;
};

// زمان بارگذاری کامپوننت مقدار اولیه رو بخون
onMounted(() => {
  setActiveStepFromRoute();
});

// در صورت تغییر روت مقدار step رو به‌روز کن
watch(
  () => route.query.step,
  () => {
    setActiveStepFromRoute();
  },
);

// هنگام کلیک روی استپ
const goToStep = (index, stepName) => {
  router.push({ name: 'ResumeForms', query: { step: stepName } });
  isMobileListOpen.value = false;
};
</script>

<template>
  <div class="stepper">
    <div class="stepper__desktop">
      <div
        v-for="(step, index) in stepItems"
        :key="index"
        class="stepper__item"
        :class="{ active: index === activeStep }"
        @click="goToStep(index, step.name)"
      >
        <div class="stepper__circle">{{ index + 1 }}</div>
        <div class="stepper__label">{{ step.title }}</div>
      </div>
    </div>

    <div class="stepper__mobile">
      <button class="stepper__toggle" @click="isMobileListOpen = !isMobileListOpen">
        مرحله: {{ stepItems[activeStep].title }}
      </button>
      <ul v-if="isMobileListOpen" class="stepper__list">
        <li
          v-for="(step, index) in stepItems"
          :key="index"
          :class="{ active: activeStep === index }"
          @click="goToStep(index, step.name)"
        >
          {{ step.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stepper {
  width: 100%;
  background-color: color(surface);
  padding: space(5);
  border-radius: radius(lg);

  &__desktop {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__item {
    flex: 1;
    text-align: center;
    cursor: pointer;

    .stepper__circle {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin: 0 auto 5px;
      background-color: color(disabled-soft);
      color: color(on-disabled);
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .stepper__label {
      font-size: 14px;
      color: color(on-surface);
    }

    &.active {
      .stepper__circle {
        background-color: color(primary); // primary
        color: color(on-primary);
      }

      .stepper__label {
        color: color(primary);
        font-weight: bold;
      }
    }
  }

  &__mobile {
    display: none;

    @media (max-width: 768px) {
      display: block;

      .stepper__toggle {
        width: 100%;
        padding: 1rem;
        background: color(surface);
        border: 1px solid color(outline);
        border-radius: radius(lg);
        text-align: right;
        font-weight: bold;
        color: color(on-surface);
      }

      .stepper__list {
        margin-top: 0.5rem;
        list-style: none;
        padding: 0;
        border: 1px solid color(outline);
        border-radius: radius(lg);
        overflow: hidden;

        li {
          padding: 1rem;
          background: color(surface);
          border-top: 1px solid color(outline);
          cursor: pointer;
          color: color(on-surface);

          &.active {
            background-color: color(primary-container);
            color: color(on-primary-container);
            font-weight: bold;
          }

          &:first-child {
            border-top: none;
          }
        }
      }
    }
  }
}
</style>
