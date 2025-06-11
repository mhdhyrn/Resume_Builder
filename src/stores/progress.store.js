import { defineStore } from 'pinia';

export const useProgressStore = defineStore('progress', {
  state: () => ({
    sections: {
      personalInfo: {
        isCompleted: false,
        weight: 15,
      },
      contactInfo: {
        isCompleted: false,
        weight: 15,
      },
      education: {
        isCompleted: false,
        weight: 15,
      },
      workExperience: {
        isCompleted: false,
        weight: 15,
      },
      skills: {
        isCompleted: false,
        weight: 15,
      },
      languages: {
        isCompleted: false,
        weight: 15,
      },
      certificates: {
        isCompleted: false,
        weight: 10,
      },
    },
  }),

  getters: {
    totalProgress: (state) => {
      let progress = 0;
      let totalWeight = 0;

      Object.values(state.sections).forEach((section) => {
        if (section.isCompleted) {
          progress += section.weight;
        }
        totalWeight += section.weight;
      });

      return Math.round((progress / totalWeight) * 100);
    },
  },

  actions: {
    setSectionProgress(sectionName, isCompleted) {
      if (this.sections[sectionName]) {
        this.sections[sectionName].isCompleted = isCompleted;
      }
    },

    // این متد برای بررسی وضعیت تکمیل هر بخش استفاده می‌شود
    checkSectionCompletion(sectionName, data) {
      switch (sectionName) {
        case 'personalInfo':
          this.setSectionProgress(
            sectionName,
            data && data.gender && data.is_married !== undefined,
          );
          break;

        case 'contactInfo':
          this.setSectionProgress(sectionName, data && data.phone_number && data.email);
          break;

        case 'education':
          this.setSectionProgress(sectionName, Array.isArray(data) && data.length > 0);
          break;

        case 'workExperience':
          this.setSectionProgress(sectionName, Array.isArray(data) && data.length > 0);
          break;

        case 'skills':
          this.setSectionProgress(sectionName, Array.isArray(data) && data.length > 0);
          break;

        case 'languages':
          this.setSectionProgress(sectionName, Array.isArray(data) && data.length > 0);
          break;

        case 'certificates':
          this.setSectionProgress(sectionName, Array.isArray(data) && data.length > 0);
          break;
      }
    },

    // این متد برای بررسی کل پیشرفت فرم استفاده می‌شود
    checkAllSections(resumeData) {
      if (!resumeData) return;

      this.checkSectionCompletion('personalInfo', resumeData.personal_info);
      this.checkSectionCompletion('contactInfo', resumeData.contact_info);
      this.checkSectionCompletion('education', resumeData.education);
      this.checkSectionCompletion('workExperience', resumeData.work_experiences);
      this.checkSectionCompletion('skills', resumeData.skills);
      this.checkSectionCompletion('languages', resumeData.languages);
      this.checkSectionCompletion('certificates', resumeData.certificates);
    },
  },

  persist: true, // این گزینه باعث می‌شود داده‌ها در localStorage ذخیره شوند
});
