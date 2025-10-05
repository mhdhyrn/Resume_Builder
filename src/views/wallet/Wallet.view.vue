<script setup>
import { ref, onMounted } from 'vue';
import TextField from '@/components/TextField.component.vue';
import Button from '@/components/Button.component.vue';
import FileUploader from '@/components/FileUploader.component.vue';
import {
  getWalletBalance,
  getMyWalletCharges,
  createWalletCharge,
} from '@/services/api/wallet.service';
import { notify } from '@/plugins/toast';

const balance = ref(0);
const isLoading = ref(false);
const isSubmitting = ref(false);
const charges = ref([]);

const form = ref({ amount: '', receipt: null });

const fetchData = async () => {
  try {
    isLoading.value = true;
    const [balanceRes, chargesRes] = await Promise.all([
      getWalletBalance(),
      getMyWalletCharges({ skip: 0, limit: 100 }),
    ]);
    balance.value = balanceRes?.data ?? 0;
    charges.value = Array.isArray(chargesRes?.data) ? chargesRes.data : [];
  } catch (error) {
    notify({ message: error?.message || 'خطا در دریافت اطلاعات کیف پول', type: 'error' });
  } finally {
    isLoading.value = false;
  }
};

const submitCharge = async () => {
  try {
    if (!form.value.amount || Number(form.value.amount) <= 0) {
      notify({ message: 'مبلغ شارژ معتبر نیست', type: 'error' });
      return;
    }
    if (!form.value.receipt) {
      notify({ message: 'آپلود تصویر فیش الزامی است', type: 'error' });
      return;
    }

    isSubmitting.value = true;
    const res = await createWalletCharge({
      amount: form.value.amount,
      receipt: form.value.receipt,
    });
    if (res?.status === 200 || res?.status === 201) {
      notify({ message: 'درخواست شارژ ثبت شد', type: 'success' });
      form.value = { amount: '', receipt: null };
      await fetchData();
    }
  } catch (error) {
    notify({ message: error?.message || 'خطا در ثبت درخواست شارژ', type: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <section class="admin-content-inner">
    <div class="content-header">
      <h2 class="title">کیف پول من</h2>
    </div>

    <div v-if="isLoading" class="loading">در حال بارگذاری...</div>

    <div v-else class="wallet-grid">
      <div class="card">
        <h3 class="card__title">موجودی فعلی</h3>
        <div class="balance">{{ Number(balance).toLocaleString() }} تومان</div>
      </div>

      <div class="card">
        <h3 class="card__title">درخواست شارژ</h3>
        <div class="form-grid">
          <TextField v-model="form.amount" name="amount" label="مبلغ (تومان)" type="number" />
          <div>
            <label class="file-label">تصویر فیش *</label>
            <FileUploader
              :value="form.receipt"
              accept="image/*"
              :label="'انتخاب تصویر'"
              @update:value="(file) => (form.receipt = file)"
            />
          </div>
        </div>
        <div class="form-actions">
          <Button :text="'ثبت درخواست'" :isLoading="isSubmitting" :handler="submitCharge" />
        </div>
      </div>

      <div class="card">
        <h3 class="card__title">تراکنش‌ها</h3>
        <div v-if="charges.length === 0" class="empty">تراکنشی یافت نشد</div>
        <div v-else class="charges-list">
          <div class="charge-item" v-for="ch in charges" :key="ch.id">
            <div class="charge-item__row">
              <span>شناسه</span>
              <span>#{{ ch.id }}</span>
            </div>
            <div class="charge-item__row">
              <span>مبلغ</span>
              <span>{{ Number(ch.amount).toLocaleString() }} تومان</span>
            </div>
            <div class="charge-item__row">
              <span>وضعیت</span>
              <span>{{ ch.status }}</span>
            </div>
            <div class="charge-item__row">
              <span>زمان</span>
              <span>{{ new Date(ch.time).toLocaleString('fa-IR') }}</span>
            </div>
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
.wallet-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.card {
  background: color(surface-container);
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 20px;
}
.card__title {
  margin: 0 0 16px 0;
  color: color(on-surface);
  font-weight: 600;
}
.balance {
  font-size: 1.5rem;
  font-weight: 700;
  color: color(primary);
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.file-label {
  color: color(on-surface);
  font-size: 0.875rem;
  margin-bottom: 8px;
  display: inline-block;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.charges-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.charge-item {
  border: 1px solid color(outline);
  border-radius: radius(md);
  padding: 12px;
  background: color(surface);
}
.charge-item__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: color(on-surface);
}
.empty {
  color: color(on-surface-variant);
}
</style>
