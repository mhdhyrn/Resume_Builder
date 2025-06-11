<template>
  <div class="main">
    <div class="title">دانلود رزومه</div>
    <div class="form">
      <div class="description">رزومه شما آماده دانلود است</div>
      <div class="subtitle">لطفاً قالب مورد نظر خود را انتخاب کنید:</div>

      <div class="templates-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card"
          :class="{ selected: selectedTemplate?.id === template.id }"
          @click="selectTemplate(template)"
        >
          <img :src="template.image" :alt="template.title" class="template-image" />
          <div class="template-title">{{ template.title }}</div>
        </div>
      </div>

      <div class="submit-row">
        <Button class="submit-btn" v-bind="submitButtonConfig" @click="handleSubmit" />
      </div>
    </div>

    <Modal :is-open="isShareModalOpen" title="اشتراک‌گذاری رزومه" @close="handleCloseShareModal">
      <div class="share-content">
        <p>رزومه شما با موفقیت دانلود شد!</p>
        <p>آیا می‌خواهید پروفایل خود را با دیگران به اشتراک بگذارید؟</p>
        <p>با اشتراک‌گذاری پروفایل، دیگران می‌توانند رزومه شما را مشاهده کنند.</p>
      </div>
      <template #footer>
        <Button text="اشتراک‌گذاری پروفایل" @click="handleShareProfile" />
        <Button text="بستن" variant="outline" @click="handleCloseShareModal" />
      </template>
    </Modal>

    <QRCodeModal
      :is-open="isQRCodeModalOpen"
      :qr-code-url="qrCodeUrl"
      :profile-url="profileUrl"
      @close="handleCloseQRCodeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from '../Button.component.vue';
import LoadingComponent from '../Loading.component.vue';
import Modal from '../Modal.component.vue';
import templates from '@/constants/templates.constant';
import { downloadResume } from '@/services/api/resume.service';
import { getPersonalInfo } from '@/services/api/personal-info.service';
import { generateQRCode } from '@/services/api/qrcode.service';
import QRCodeModal from '../QRCodeModal.component.vue';

const selectedTemplate = ref(null);
const isButtonLoading = ref(false);
const isShareModalOpen = ref(false);
const isQRCodeModalOpen = ref(false);
const qrCodeUrl = ref('');
const profileUrl = ref('');

const submitButtonConfig = reactive({
  text: 'دانلود رزومه',
  isDisabled: computed(() => !selectedTemplate.value),
  isLoading: computed(() => isButtonLoading.value),
});

const handleSubmit = async () => {
  if (!selectedTemplate.value) return;

  try {
    isButtonLoading.value = true;
    const response = await downloadResume(selectedTemplate.value.id);

    // ایجاد Blob از داده‌های دریافتی
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // ایجاد لینک دانلود و کلیک روی آن
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();

    // پاکسازی
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    // نمایش مودال اشتراک‌گذاری
    isShareModalOpen.value = true;
  } catch (error) {
    console.error('خطا در دانلود رزومه:', error);
    // اینجا می‌تونیم یک نوتیفیکیشن خطا نمایش بدیم
  } finally {
    isButtonLoading.value = false;
  }
};

const selectTemplate = (template) => {
  selectedTemplate.value = template;
};

const handleShareProfile = async () => {
  try {
    // دریافت user_id
    const personalInfoResponse = await getPersonalInfo();
    const userId = personalInfoResponse.data.user_id;

    // ساخت URL پروفایل
    const url = `${window.location.origin}/resume/profile/${userId}`;
    profileUrl.value = url;

    // دریافت QR code
    const qrResponse = await generateQRCode(url);
    qrCodeUrl.value = URL.createObjectURL(qrResponse.data);

    // بستن مودال قبلی و نمایش مودال QR code
    isShareModalOpen.value = false;
    isQRCodeModalOpen.value = true;
  } catch (error) {
    console.error('خطا در دریافت QR code:', error);
  }
};

const handleCloseShareModal = () => {
  isShareModalOpen.value = false;
};

const handleCloseQRCodeModal = () => {
  isQRCodeModalOpen.value = false;
  URL.revokeObjectURL(qrCodeUrl.value);
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @include flex($direction: column, $justify: center, $align: center, $gap: space(5));
}

.title {
  width: 70%;
  @include typography(lg, bold);
}

.form {
  background-color: color(surface);
  padding: 2rem;
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  width: 70%;
}

.description {
  text-align: center;
  @include typography(md);
  margin-bottom: space(5);
}

.subtitle {
  @include typography(md, bold);
  margin-bottom: space(4);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: space(4);
  margin-bottom: space(6);
}

.template-card {
  background-color: color(surface);
  border: 2px solid color(disabled-soft);
  border-radius: radius(lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: color(primary);
    box-shadow: 0 0 0 2px color(primary-soft);
  }
}

.template-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid color(disabled-soft);
}

.template-title {
  padding: space(3);
  text-align: center;
  @include typography(md, bold);
}

.submit-row {
  margin-top: space(4);
  text-align: left;
  @include flex($justify: end, $align: center);
}

.submit-btn {
  width: remify(300);
}

.share-content {
  text-align: center;
  @include flex($direction: column, $gap: space(3));

  p {
    @include typography(md);
    color: color(on-surface);
    margin: 0;

    &:first-child {
      @include typography(lg, bold);
      color: color(primary);
    }
  }
}
</style>
