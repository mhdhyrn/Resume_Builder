<script setup>
import { ref, computed, onMounted } from 'vue';
import TextField from '../TextField.component.vue';
import Button from '../Button.component.vue';
import { useRouter } from 'vue-router';
import { certificateStore } from '@/stores/certificate.store';
import { notify } from '@/plugins/toast';
import LoadingComponent from '../Loading.component.vue';
import { useProgressStore } from '@/stores/progress.store';
import { useProgressbarStore } from '@/stores/progressbar.store';

const router = useRouter();
const store = certificateStore();
const progressStore = useProgressStore();
const progressbarStore = useProgressbarStore();
const isLoading = ref(true);

const emptyForm = {
  title: '',
  institute: '',
  date: null,
  link: '',
};

const formFields = ref({ ...emptyForm });
const editingId = ref(null);

// Load certificates
onMounted(async () => {
  try {
    await store.fetchCertificates();
  } catch (error) {
    notify({
      message: 'خطا در دریافت اطلاعات',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  formFields.value = { ...emptyForm };
  editingId.value = null;
};

const editCertificate = (certificate) => {
  formFields.value = {
    title: certificate.title || '',
    institute: certificate.institute || '',
    date: certificate.date || null,
    link: certificate.link || '',
  };
  editingId.value = certificate.id;
};

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await store.updateCertificate(editingId.value, formFields.value);
      notify({
        message: 'گواهینامه با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      await store.createCertificate(formFields.value);
      if (store.certificates.length === 1) {
        await progressbarStore.updateProgressbar();
      }
      notify({
        message: 'گواهینامه با موفقیت اضافه شد',
        type: 'success',
      });
    }
    resetForm();
  } catch (error) {
    notify({
      message: error.message || 'خطا در ذخیره اطلاعات',
      type: 'error',
    });
  }
};

const handleDelete = async (id) => {
  try {
    await store.deleteCertificate(id);
    if (store.certificates.length === 0) {
      await progressbarStore.updateProgressbar();
    }
    notify({
      message: 'گواهینامه با موفقیت حذف شد',
      type: 'success',
    });
    if (editingId.value === id) {
      resetForm();
    }
  } catch (error) {
    notify({
      message: error.message || 'خطا در حذف اطلاعات',
      type: 'error',
    });
  }
};

const handleNext = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  router.push({ name: 'ResumeForms', query: { step: 'final' } });
};

const isFormValid = computed(() => {
  return formFields.value.title && formFields.value.institute;
});

const saveCertificate = async () => {
  try {
    const response = await store.updateCertificates(store.certificates);
    progressStore.checkSectionCompletion('certificates', response.data);
    // ... rest of the save logic ...
  } catch (error) {
    console.error('خطا در ذخیره گواهینامه‌ها:', error);
  }
};
</script>

<template>
  <div class="main">
    <div class="loading-container" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div class="title">گواهینامه‌ها</div>

      <!-- لیست گواهینامه‌ها -->
      <div v-if="store.certificates.length > 0" class="certificates-list">
        <TransitionGroup name="list">
          <div
            v-for="certificate in store.certificates"
            :key="certificate.id"
            class="certificate-card"
          >
            <div class="certificate-info">
              <h3>{{ certificate.title }}</h3>
              <p>{{ certificate.institute }}</p>
              <p v-if="certificate.date">{{ certificate.date }}</p>
              <p v-if="certificate.link">
                <a :href="certificate.link" target="_blank" rel="noopener noreferrer"
                  >مشاهده گواهینامه</a
                >
              </p>
            </div>
            <div class="certificate-actions">
              <button class="edit-btn" @click="editCertificate(certificate)">ویرایش</button>
              <button class="delete-btn" @click="handleDelete(certificate.id)">حذف</button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- فرم -->
      <form class="form" @submit.prevent="handleSubmit">
        <div class="grid">
          <TextField
            v-model="formFields.title"
            label="عنوان گواهینامه"
            rules="required"
            name="title"
          />
          <TextField
            v-model="formFields.institute"
            label="موسسه صادرکننده"
            rules="required"
            name="institute"
          />
          <TextField v-model="formFields.link" label="لینک گواهینامه" name="link" />
        </div>

        <div class="form-actions">
          <Button
            :text="editingId ? 'ویرایش گواهینامه' : 'افزودن گواهینامه'"
            :is-loading="store.createLoading || store.updateLoading"
            :is-disabled="!isFormValid"
            type="submit"
          />
          <Button v-if="editingId" color="warning" text="انصراف" type="button" @click="resetForm" />
        </div>

        <!-- دکمه مرحله بعد -->
        <div class="next-step">
          <Button text="مرحله بعد" @click="handleNext" />
        </div>
      </form>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  @include flex($direction: column, $justify: center, $align: center, $gap: space(5));
}

.loading-container {
  width: 70%;
  height: 100%;
}

.title {
  width: 70%;
  @include typography(lg, bold);

  @media (max-width: 768px) {
    width: 90%;
  }
}

.certificates-list {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: space(3);
  margin-bottom: space(5);

  @media (max-width: 768px) {
    width: 90%;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.certificate-card {
  background-color: color(surface);
  padding: space(4);
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .certificate-info {
    h3 {
      @include typography(md, bold);
      margin-bottom: space(2);
    }

    p {
      @include typography(sm);
      color: color(on-surface-variant);
      margin-bottom: space(1);

      a {
        color: color(primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .certificate-actions {
    display: flex;
    gap: space(2);
  }
}

.form {
  background-color: color(surface);
  padding: 2rem;
  border-radius: radius(lg);
  box-shadow: 0 0 8px rgba(148, 148, 148, 0.05);
  width: 70%;

  @media (max-width: 768px) {
    width: 90%;
    padding: 1rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.form-actions {
  width: 50%;
  margin-top: space(4);
  display: flex;
  gap: space(2);
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

.next-step {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: space(10);

  button {
    width: 30%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.edit-btn {
  padding: space(2) space(4);
  background-color: color(secondary);
  color: color(on-secondary);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  min-width: 80px;
}

.delete-btn {
  padding: space(2) space(4);
  background-color: color(error);
  color: color(on-error);
  border: none;
  border-radius: radius(md);
  cursor: pointer;
  min-width: 80px;
}
</style>
