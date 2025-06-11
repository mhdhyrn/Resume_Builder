import { defineStore } from 'pinia';
import { getUserProfile } from '@/services/api/profile.service';
import { getUserProfile as getPersonalProfile } from '@/services/api/personal-info.service';
import { useProgressStore } from './progress.store';

export const useProgressbarStore = defineStore('progressbar', {
  state: () => ({
    loading: false,
  }),

  actions: {
    async updateProgressbar() {
      try {
        this.loading = true;
        // اول اطلاعات کاربر رو از personal-info می‌گیریم
        const personalResponse = await getPersonalProfile();
        const userId = personalResponse.data.id;

        // حالا با user_id درخواست getUserProfile رو می‌زنیم
        const response = await getUserProfile(userId);
        const resumeData = response.data.resume;

        // به‌روزرسانی پیشرفت در store اصلی
        const progressStore = useProgressStore();
        progressStore.checkAllSections(resumeData);
      } catch (error) {
        console.error('خطا در به‌روزرسانی پراگرس بار:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
