<script setup>
import { ref, onMounted } from 'vue';
import {
  getWalletCharges,
  acceptWalletCharge,
  rejectWalletCharge,
} from '@/services/api/admin.service';
import { notify } from '@/plugins/toast';
import Modal from '@/components/Modal.component.vue';
import Button from '@/components/Button.component.vue';
import { getServerUrl } from '@/utils/url';

const items = ref([]);
const loading = ref(false);
const isConfirmOpen = ref(false);
const confirmAction = ref(null);
const selectedId = ref(null);

const isPending = (status) => String(status || '').toUpperCase() === 'PENDING';

const fetchData = async () => {
  try {
    loading.value = true;
    const res = await getWalletCharges();
    items.value = res?.data || [];
  } catch (error) {
    notify({ message: error?.message || 'خطا در دریافت لیست', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const openConfirm = (action, id) => {
  confirmAction.value = action;
  selectedId.value = id;
  isConfirmOpen.value = true;
};

const handleConfirm = async () => {
  try {
    if (confirmAction.value === 'accept') {
      await acceptWalletCharge(selectedId.value);
      notify({ message: 'درخواست تایید شد', type: 'success' });
    } else if (confirmAction.value === 'reject') {
      await rejectWalletCharge(selectedId.value);
      notify({ message: 'درخواست رد شد', type: 'success' });
    }
    isConfirmOpen.value = false;
    await fetchData();
  } catch (error) {
    notify({ message: error?.message || 'خطا در انجام عملیات', type: 'error' });
  }
};

onMounted(fetchData);

const baseURL = 'http://185.204.169.71:8000/';
</script>

<template>
  <section class="admin-content-inner">
    <h2 class="title">درخواست‌های در انتظار</h2>
    <div v-if="loading" class="loading">در حال بارگذاری...</div>
    <div v-else class="list">
      <div v-for="item in items" :key="item.id" class="card">
        <div class="row">
          <span>کاربر:</span><b>{{ item.user_id }}</b>
        </div>
        <div class="row">
          <span>مبلغ:</span><b>{{ item.amount }}</b>
        </div>
        <div class="row">
          <span>زمان:</span><b>{{ item.time }}</b>
        </div>
        <div class="row">
          <span>وضعیت:</span>
          <b :class="['status', `status--${String(item.status || '').toLowerCase()}`]">
            {{ item.status }}
          </b>
        </div>
        <div class="row">
          <span>رسید:</span>
          <a :href="getServerUrl(baseURL + item.receipt_path)" target="_blank">مشاهده تصویر</a>
        </div>
        <div class="actions" v-if="isPending(item.status)">
          <Button text="تایید" color="success" @click="() => openConfirm('accept', item.id)" />
          <Button
            text="رد"
            color="error"
            variant="outline"
            @click="() => openConfirm('reject', item.id)"
          />
        </div>
      </div>
      <p v-if="items.length === 0" class="empty">موردی برای نمایش نیست</p>
    </div>

    <Modal :is-open="isConfirmOpen" title="تایید نهایی" @close="() => (isConfirmOpen = false)">
      <p>آیا از انجام این عملیات مطمئن هستید؟</p>
      <template #footer>
        <Button text="بله" color="primary" @click="handleConfirm" />
        <Button text="خیر" variant="outline" @click="() => (isConfirmOpen = false)" />
      </template>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
.admin-content-inner {
  color: color(on-surface);
}
.title {
  margin-bottom: 16px;
}
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.card {
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 12px;
  background: color(surface-container);
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: color(on-surface);
}
.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
.status {
  &--pending {
    color: color(warning);
  }
  &--accepted,
  &--accept {
    color: color(success);
  }
  &--rejected,
  &--reject {
    color: color(error);
  }
}
.empty {
  color: color(on-surface-variant);
}
.loading {
  color: color(on-surface);
}
</style>
