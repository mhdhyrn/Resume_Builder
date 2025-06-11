import { useProgressStore } from '@/stores/progress.store';
import { getUserProfile } from '@/services/api/profile.service';
import { getUserProfile as getPersonalProfile } from '@/services/api/personal-info.service';

export const useProgress = () => {
  const progressStore = useProgressStore();

  const updateProgress = async () => {
    try {
      // اول اطلاعات کاربر رو از personal-info می‌گیریم
      const personalResponse = await getPersonalProfile();
      const userId = personalResponse.data.id;

      // حالا با user_id درخواست getUserProfile رو می‌زنیم
      const response = await getUserProfile(userId);
      progressStore.checkAllSections(response.data.resume);
    } catch (error) {
      console.error('خطا در به‌روزرسانی پیشرفت:', error);
    }
  };

  return {
    updateProgress,
  };
};
