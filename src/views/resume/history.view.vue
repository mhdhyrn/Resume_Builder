<script setup>
import { ref, onMounted } from 'vue';
import Button from '@/components/Button.component.vue';
import { getMyResumeHistory, downloadResumeById } from '@/services/api/pdf.service';
import { notify } from '@/plugins/toast';
import { getServerUrl } from '@/utils/url';

const isLoading = ref(false);
const items = ref([]);
const total = ref(0);

const fetchHistory = async () => {
  try {
    isLoading.value = true;
    const res = await getMyResumeHistory({ skip: 0, limit: 50 });
    const data = res?.data || {};
    items.value = Array.isArray(data.items) ? data.items : [];
    total.value = data.total || items.value.length || 0;
  } catch (error) {
    notify({ message: error?.message || 'خطا در دریافت تاریخچه رزومه‌ها', type: 'error' });
  } finally {
    isLoading.value = false;
  }
};

const handleDownload = async (id) => {
  try {
    await downloadResumeById(id);
  } catch (error) {
    notify({ message: error?.message || 'خطا در دانلود رزومه', type: 'error' });
  }
};

onMounted(fetchHistory);
</script>

<template>
  <section class="admin-content-inner">
    <div class="content-header">
      <h2 class="title">رزومه‌های من</h2>
    </div>

    <div v-if="isLoading" class="loading">در حال بارگذاری...</div>

    <div v-else>
      <div v-if="items.length === 0" class="empty">موردی یافت نشد</div>
      <div v-else class="history-grid">
        <div class="history-item" v-for="it in items" :key="it.id">
          <div class="history-item__row">
            <span>شماره</span>
            <span>#{{ it.id }}</span>
          </div>
          <div class="history-item__row">
            <span>نام فایل</span>
            <span>{{ it.file_name }}</span>
          </div>
          <div class="history-item__row">
            <span>حجم</span>
            <span>{{ (it.file_size_bytes / 1024).toFixed(1) }} KB</span>
          </div>
          <div class="history-item__row">
            <span>تاریخ</span>
            <span>{{ new Date(it.created_at).toLocaleString('fa-IR') }}</span>
          </div>
          <div class="history-item__actions">
            <Button text="دانلود" variant="outline" :handler="() => handleDownload(it.id)" />
          </div>
        </div>
      </div>
    </div>
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
.empty {
  color: color(on-surface-variant);
}
.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.history-item {
  background: color(surface-container);
  border: 1px solid color(outline);
  border-radius: radius(md);
  padding: 12px;
}
.history-item__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: color(on-surface);
}
.history-item__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>

