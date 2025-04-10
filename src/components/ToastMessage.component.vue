<script setup>
const props = defineProps({
  content: {
    type: String,
  },
});
</script>
<template>
  <div class="custom-toast">
    <div class="custom-toast__body">
      <span class="custom-toast__content">{{ content }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-toast {
  height: 100%;
  width: 100%;
  gap: space(2);
  padding: space(2.5);

  @include flex(column, nowrap, flex-start, flex-start);

  &__content {
    flex: 1;
  }
}
</style>
