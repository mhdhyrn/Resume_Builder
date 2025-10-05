<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import TextField from '@/components/TextField.component.vue';
import TextArea from '@/components/TextArea.component.vue';
import Button from '@/components/Button.component.vue';
import FileUploader from '@/components/FileUploader.component.vue';
import DropdownComponent from '@/components/Dropdown.component.vue';
import { getTemplate, createTemplate, updateTemplate } from '@/services/api/admin.service';
import { notify } from '@/plugins/toast';
import { adminRoutes } from '@/constants/router';
import { usePromise } from '@/composables';

const router = useRouter();
const route = useRoute();
const { meta: formMeta } = useForm();

const isEdit = computed(() => route.params.id !== 'new');
const templateId = computed(() => route.params.id);

const formData = reactive({
  name: '',
  description: '',
  direction: 'ltr',
  language: 'English',
  price: 0,
  is_free: true,
  is_enabled: true,
  category: '',
  sort_order: 0,
  template_file: null,
  preview_file: null,
});

const directionOptions = [
  { value: 'ltr', label: 'چپ به راست' },
  { value: 'rtl', label: 'راست به چپ' },
];

const languageOptions = [
  { value: 'English', label: 'انگلیسی' },
  { value: 'Persian', label: 'فارسی' },
  { value: 'Arabic', label: 'عربی' },
];

const categoryOptions = [
  { value: 'professional', label: 'حرفه‌ای' },
  { value: 'creative', label: 'خلاقانه' },
  { value: 'minimal', label: 'مینیمال' },
  { value: 'modern', label: 'مدرن' },
  { value: 'classic', label: 'کلاسیک' },
];

const fieldsConfig = {
  name: { label: 'نام تمپلیت', rules: 'required' },
  description: { label: 'توضیحات', rules: '' },
  category: { label: 'دسته‌بندی', rules: '' },
  price: { label: 'قیمت (تومان)', rules: 'numeric' },
  sort_order: { label: 'ترتیب نمایش', rules: 'numeric' },
};

const { execute: fetchTemplate, loading: isFetching } = usePromise(getTemplate);
const { execute: saveTemplate, loading: isSaving } = usePromise(
  isEdit.value ? updateTemplate : createTemplate,
);

const loadTemplate = async () => {
  if (isEdit.value) {
    try {
      const response = await fetchTemplate(templateId.value);
      if (response?.data) {
        const template = response.data;
        Object.assign(formData, {
          name: template.name || '',
          description: template.description || '',
          direction: template.direction || 'ltr',
          language: template.language || 'English',
          price: template.price || 0,
          is_free: template.is_free ?? true,
          is_enabled: template.is_enabled ?? true,
          category: template.category || '',
          sort_order: template.sort_order || 0,
        });
      }
    } catch (error) {
      notify({ message: error?.message || 'خطا در بارگذاری تمپلیت', type: 'error' });
    }
  }
};

const handleSubmit = async () => {
  try {
    // Validation
    if (!formData.name.trim()) {
      notify({ message: 'نام تمپلیت الزامی است', type: 'error' });
      return;
    }

    if (!isEdit.value && !formData.template_file) {
      notify({ message: 'فایل تمپلیت الزامی است', type: 'error' });
      return;
    }

    const formDataToSend = new FormData();

    // Add text fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'template_file' && key !== 'preview_file') {
        if (key === 'is_free' || key === 'is_enabled') {
          formDataToSend.append(key, formData[key] ? 'true' : 'false');
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    // Add files if they exist
    if (formData.template_file) {
      formDataToSend.append('template_file', formData.template_file);
    }
    if (formData.preview_file) {
      formDataToSend.append('preview_file', formData.preview_file);
    }

    const response = isEdit.value
      ? await saveTemplate(templateId.value, formDataToSend)
      : await saveTemplate(formDataToSend);

    if (response?.status === 200 || response?.status === 201) {
      notify({
        message: `تمپلیت ${isEdit.value ? 'ویرایش' : 'ایجاد'} شد`,
        type: 'success',
      });
      router.push({ name: adminRoutes.TEMPLATES_NAME });
    }
  } catch (error) {
    console.error('Submit error:', error);
    notify({ message: error?.message || 'خطا در ذخیره تمپلیت', type: 'error' });
  }
};

const handleFileSelect = (field, file) => {
  formData[field] = file;
};

const handleFileRemove = (field) => {
  formData[field] = null;
};

const goBack = () => {
  router.push({ name: adminRoutes.TEMPLATES_NAME });
};

onMounted(loadTemplate);
</script>

<template>
  <section class="admin-content-inner">
    <div class="content-header">
      <h2 class="title">
        {{ isEdit ? 'ویرایش تمپلیت' : 'افزودن تمپلیت جدید' }}
      </h2>
      <Button text="بازگشت" variant="outline" @click="goBack" />
    </div>

    <div v-if="isFetching" class="loading">در حال بارگذاری...</div>

    <form v-else class="template-form" @submit.prevent="handleSubmit">
      <div class="form-section">
        <h3 class="section-title">اطلاعات اصلی</h3>
        <div class="form-grid">
          <TextField v-model="formData.name" name="name" v-bind="fieldsConfig.name" />
          <DropdownComponent
            v-model="formData.category"
            name="category"
            label="دسته‌بندی"
            :options="categoryOptions"
          />
          <TextField
            v-model="formData.price"
            name="price"
            type="number"
            v-bind="fieldsConfig.price"
          />
          <TextField
            v-model="formData.sort_order"
            name="sort_order"
            type="number"
            v-bind="fieldsConfig.sort_order"
          />
        </div>

        <TextArea
          v-model="formData.description"
          name="description"
          v-bind="fieldsConfig.description"
        />
      </div>

      <div class="form-section">
        <h3 class="section-title">تنظیمات</h3>
        <div class="form-grid">
          <DropdownComponent
            v-model="formData.direction"
            name="direction"
            label="جهت متن"
            :options="directionOptions"
          />
          <DropdownComponent
            v-model="formData.language"
            name="language"
            label="زبان"
            :options="languageOptions"
          />
        </div>

        <div class="checkbox-group">
          <label class="checkbox-item">
            <input v-model="formData.is_free" type="checkbox" name="is_free" />
            <span class="checkbox-label">تمپلیت رایگان</span>
          </label>
          <label class="checkbox-item">
            <input v-model="formData.is_enabled" type="checkbox" name="is_enabled" />
            <span class="checkbox-label">تمپلیت فعال</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">فایل‌ها</h3>
        <div class="file-uploads">
          <div class="file-upload-item">
            <label class="file-upload-label">فایل تمپلیت HTML *</label>
            <FileUploader
              :value="formData.template_file"
              accept=".html,.htm"
              :label="'انتخاب فایل HTML'"
              :hint="'فایل HTML تمپلیت را انتخاب کنید'"
              @update:value="(file) => handleFileSelect('template_file', file)"
              @remove="() => handleFileRemove('template_file')"
            />
          </div>

          <div class="file-upload-item">
            <label class="file-upload-label">تصویر پیش‌نمایش</label>
            <FileUploader
              :value="formData.preview_file"
              accept="image/*"
              :label="'انتخاب تصویر'"
              :hint="'تصویر پیش‌نمایش تمپلیت (اختیاری)'"
              @update:value="(file) => handleFileSelect('preview_file', file)"
              @remove="() => handleFileRemove('preview_file')"
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <Button text="انصراف" variant="outline" @click="goBack" />
        <Button
          :text="isEdit ? 'ویرایش تمپلیت' : 'ایجاد تمپلیت'"
          type="submit"
          :isLoading="isSaving"
          :isDisabled="!formMeta.valid"
        />
      </div>
    </form>
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

.template-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  background: color(surface-container);
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 24px;
}

.section-title {
  margin: 0 0 20px 0;
  color: color(on-surface);
  font-size: 1.125rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label {
  color: color(on-surface);
  font-size: 0.875rem;
}

.file-uploads {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.file-upload-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-upload-label {
  color: color(on-surface);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid color(outline);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
