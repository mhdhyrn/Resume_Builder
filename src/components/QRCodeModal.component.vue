<script setup>
import Modal from './Modal.component.vue';
import Button from './Button.component.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  qrCodeUrl: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};

const goToProfile = () => {
  window.open(props.profileUrl, '_blank');
};
</script>

<template>
  <Modal :is-open="isOpen" title="اشتراک‌گذاری با QR Code" @close="handleClose">
    <div class="qr-content">
      <img :src="qrCodeUrl" alt="QR Code" class="qr-image" />
      <p class="qr-description">
        با اسکن این QR Code یا کلیک روی دکمه زیر، می‌توانید پروفایل خود را مشاهده کنید.
      </p>
    </div>

    <template #footer>
      <Button text="مشاهده پروفایل" @click="goToProfile" />
      <Button text="بستن" variant="outline" @click="handleClose" />
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: space(4);
  padding: space(4) 0;
}

.qr-image {
  max-width: 250px;
  width: 100%;
  height: auto;
  border-radius: radius(md);
}

.qr-description {
  text-align: center;
  color: color(on-surface-variant);
  @include typography(md);
  margin: 0;
}
</style>
