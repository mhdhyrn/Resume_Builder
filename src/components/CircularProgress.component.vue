<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
  size: {
    type: Number,
    default: 120,
  },
  strokeWidth: {
    type: Number,
    default: 8,
  },
});

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(
  () => circumference.value - (props.progress / 100) * circumference.value,
);

const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);
</script>

<template>
  <div class="circular-progress" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :viewBox="viewBox">
      <!-- دایره پس‌زمینه -->
      <circle
        class="progress-background"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- دایره پیشرفت -->
      <circle
        class="progress-circle"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="progress-text">
      <slot>
        <span class="percentage">{{ progress }}%</span>
        <span class="label">تکمیل شده</span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circular-progress {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-background {
  stroke: color(outline);
}

.progress-circle {
  stroke: color(primary);
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  inset: 0;
}

.percentage {
  @include typography(xl, bold);
  color: color(primary);
}

.label {
  @include typography(sm);
  color: color(on-surface-variant);
  margin-top: space(1);
}
</style>
