<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTemplates, deleteTemplate, toggleTemplateStatus } from '@/services/api/admin.service';
import { notify } from '@/plugins/toast';
import Modal from '@/components/Modal.component.vue';
import Button from '@/components/Button.component.vue';
import { getServerUrl } from '@/utils/url';
import { adminRoutes } from '@/constants/router';

const router = useRouter();
const templates = ref([]);
const loading = ref(false);
const isDeleteModalOpen = ref(false);
const selectedTemplate = ref(null);

const fetchTemplates = async () => {
  try {
    loading.value = true;
    const res = await getTemplates({ skip: 0, limit: 100 });
    templates.value = res?.data || [];
  } catch (error) {
    notify({ message: error?.message || 'خطا در دریافت لیست تمپلیت‌ها', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const goToAddTemplate = () => {
  router.push({ name: adminRoutes.TEMPLATE_EDIT_NAME, params: { id: 'new' } });
};

const goToEditTemplate = (templateId) => {
  router.push({ name: adminRoutes.TEMPLATE_EDIT_NAME, params: { id: templateId } });
};

const openDeleteModal = (template) => {
  selectedTemplate.value = template;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  try {
    await deleteTemplate(selectedTemplate.value.id);
    notify({ message: 'تمپلیت با موفقیت حذف شد', type: 'success' });
    isDeleteModalOpen.value = false;
    await fetchTemplates();
  } catch (error) {
    notify({ message: error?.message || 'خطا در حذف تمپلیت', type: 'error' });
  }
};

const handleToggleStatus = async (template) => {
  try {
    await toggleTemplateStatus(template.id);
    template.is_enabled = !template.is_enabled;
    notify({
      message: `تمپلیت ${template.is_enabled ? 'فعال' : 'غیرفعال'} شد`,
      type: 'success',
    });
  } catch (error) {
    notify({ message: error?.message || 'خطا در تغییر وضعیت', type: 'error' });
  }
};

const formatPrice = (price) => {
  return price > 0 ? `${price.toLocaleString()} تومان` : 'رایگان';
};

const getStatusBadge = (isEnabled) => {
  return isEnabled ? 'فعال' : 'غیرفعال';
};

const getStatusColor = (isEnabled) => {
  return isEnabled ? 'success' : 'error';
};

onMounted(fetchTemplates);

const baseURL = 'http://185.204.169.71:8000/';
</script>

<template>
  <section class="admin-content-inner">
    <div class="content-header">
      <h2 class="title">مدیریت تمپلیت‌ها</h2>
      <Button text="افزودن تمپلیت جدید" color="primary" @click="goToAddTemplate" />
    </div>

    <div v-if="loading" class="loading">در حال بارگذاری...</div>

    <div v-else-if="templates.length === 0" class="empty-state">
      <p>هیچ تمپلیتی یافت نشد</p>
      <Button text="افزودن اولین تمپلیت" color="primary" @click="goToAddTemplate" />
    </div>

    <div v-else class="templates-grid">
      <div v-for="template in templates" :key="template.id" class="template-card">
        <div class="template-card__header">
          <h3 class="template-card__title">{{ template.name }}</h3>
          <div class="template-card__status">
            <span
              class="status-badge"
              :class="`status-badge--${getStatusColor(template.is_enabled)}`"
            >
              {{ getStatusBadge(template.is_enabled) }}
            </span>
          </div>
        </div>

        <div class="template-card__content">
          <p v-if="template.description" class="template-card__description">
            {{ template.description }}
          </p>

          <div class="template-card__details">
            <div class="detail-item">
              <span class="detail-label">قیمت:</span>
              <span class="detail-value">{{ formatPrice(template.price) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">زبان:</span>
              <span class="detail-value">{{ template.language }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">جهت:</span>
              <span class="detail-value">{{
                template.direction === 'ltr' ? 'چپ به راست' : 'راست به چپ'
              }}</span>
            </div>
            <div v-if="template.category" class="detail-item">
              <span class="detail-label">دسته‌بندی:</span>
              <span class="detail-value">{{ template.category }}</span>
            </div>
          </div>

          <div v-if="template.preview_path" class="template-card__preview">
            <img
              :src="getServerUrl(baseURL + template.preview_path)"
              :alt="template.name"
              class="preview-image"
            />
          </div>
        </div>

        <div class="template-card__actions">
          <Button text="ویرایش" variant="outline" @click="goToEditTemplate(template.id)" />
          <Button
            :text="template.is_enabled ? 'غیرفعال کردن' : 'فعال کردن'"
            :color="template.is_enabled ? 'warning' : 'success'"
            variant="outline"
            @click="handleToggleStatus(template)"
          />
          <Button text="حذف" color="error" variant="outline" @click="openDeleteModal(template)" />
        </div>
      </div>
    </div>

    <Modal
      :is-open="isDeleteModalOpen"
      title="تایید حذف"
      @close="() => (isDeleteModalOpen = false)"
    >
      <p>آیا از حذف تمپلیت "{{ selectedTemplate?.name }}" مطمئن هستید؟</p>
      <p class="warning-text">این عمل قابل بازگشت نیست.</p>
      <template #footer>
        <Button text="بله، حذف کن" color="error" @click="handleDelete" />
        <Button text="انصراف" variant="outline" @click="() => (isDeleteModalOpen = false)" />
      </template>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
.admin-content-inner {
  color: color(on-surface);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  margin: 0;
  color: color(on-surface);
}

.loading {
  text-align: center;
  color: color(on-surface-variant);
  padding: 40px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: color(on-surface-variant);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.template-card {
  background: color(surface-container);
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px color(elevation-shadow);
    transform: translateY(-2px);
  }
}

.template-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.template-card__title {
  margin: 0;
  color: color(on-surface);
  font-size: 1.25rem;
  font-weight: 600;
}

.template-card__status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: radius(sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  &--success {
    background: color(success-container);
    color: color(on-success-container);
  }

  &--error {
    background: color(error-container);
    color: color(on-error-container);
  }
}

.template-card__content {
  margin-bottom: 20px;
}

.template-card__description {
  color: color(on-surface-variant);
  margin-bottom: 16px;
  line-height: 1.5;
}

.template-card__details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: color(on-surface-variant);
  font-size: 0.875rem;
}

.detail-value {
  color: color(on-surface);
  font-weight: 500;
}

.template-card__preview {
  margin-top: 16px;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: radius(md);
  border: 1px solid color(outline);
}

.template-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.warning-text {
  color: color(error);
  font-size: 0.875rem;
  margin-top: 8px;
}
</style>
