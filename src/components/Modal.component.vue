<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleClose">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="close-button" @click="handleClose">&times;</button>
          </div>
          <div class="modal-content">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-button" @click="handleClose">بستن</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: color(surface);
  border-radius: radius(lg);
  padding: space(4);
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: space(4);
}

.modal-title {
  margin: 0;
  @include typography(lg, bold);
  color: color(on-surface);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: color(on-surface);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: radius(sm);
  transition: background-color 0.3s;

  &:hover {
    background-color: color(disabled-soft);
  }
}

.modal-content {
  margin-bottom: space(4);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: space(2);
}

.modal-button {
  padding: space(2) space(4);
  background-color: color(primary);
  color: color(on-primary);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darken(black, 10%);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
