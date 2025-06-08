<template>
  <label class="checkbox">
    <input type="checkbox" v-model="modelValue" @change="$emit('update:modelValue', modelValue)" />
    <span class="checkmark"></span>
    <slot />
  </label>
</template>

<script setup>
const modelValue = defineModel();
</script>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #1976d2;
  border-radius: 4px;
  position: relative;
}

input[type='checkbox']:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 0px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  background-color: #1976d2;
  transform: rotate(45deg);
}
</style>
