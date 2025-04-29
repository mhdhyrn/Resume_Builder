<script setup>
import { ref } from 'vue';
import { stepItems } from '@/constants';
import Dropdown from './Dropdown.component.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeStep = ref(0);
const isMobileListOpen = ref(false);

const goToStep = (index, stepName) => {
  activeStep.value = index;
  router.push({ name: 'ResumeForms', query: { step: stepName } });
};
</script>

<template>
  <div class="stepper">
    <!-- دسکتاپ -->
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

    <!-- موبایل -->
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
  margin-bottom: 2rem;

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
      background-color: #ccc;
      color: #fff;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .stepper__label {
      font-size: 14px;
      color: #666;
    }

    &.active {
      .stepper__circle {
        background-color: #3b82f6; // primary
      }

      .stepper__label {
        color: #3b82f6;
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
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        text-align: right;
        font-weight: bold;
      }

      .stepper__list {
        margin-top: 0.5rem;
        list-style: none;
        padding: 0;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;

        li {
          padding: 1rem;
          background: #fff;
          border-top: 1px solid #e5e7eb;
          cursor: pointer;

          &.active {
            background-color: #e0f2fe;
            color: #0284c7;
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
