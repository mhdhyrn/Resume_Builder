<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserProfile } from '@/services/api/profile.service';
import LoadingComponent from '@/components/Loading.component.vue';
import { getServerUrl } from '@/utils/url';
import {
  maritalStatus,
  gender,
  militaryServiceStatus,
  educationDegree,
  universityType,
  proficiencyLevel,
} from '@/constants/mappings';

const route = useRoute();
const isLoading = ref(true);
const profileData = ref(null);
const error = ref(null);

const fetchProfileData = async () => {
  try {
    const userId = route.params.userId;
    const response = await getUserProfile(userId);
    profileData.value = response.data;
  } catch (err) {
    error.value = 'خطا در دریافت اطلاعات پروفایل';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProfileData();
});
</script>

<template>
  <div class="profile-container">
    <LoadingComponent v-if="isLoading" />

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <template v-else>
      <!-- اطلاعات کاربر -->
      <div class="profile-header">
        <div class="profile-picture-container">
          <img
            :src="
              getServerUrl(profileData.user.profile_picture) ||
              '/src/assets/images/default-avatar.png'
            "
            :alt="profileData.user.first_name"
            class="profile-picture"
          />
        </div>
        <div class="profile-info">
          <h1 class="user-name">
            {{
              profileData.user.first_name && profileData.user.last_name
                ? `${profileData.user.first_name} ${profileData.user.last_name}`
                : 'بدون نام'
            }}
          </h1>
          <div class="user-details">
            <span class="detail-item">
              <i class="fas fa-phone"></i>
              {{ profileData.user.phone_number }}
            </span>
            <span v-if="profileData.user.birth_date" class="detail-item">
              <i class="fas fa-calendar"></i>
              {{ profileData.user.birth_date }}
            </span>
          </div>
        </div>
      </div>

      <!-- اطلاعات رزومه -->
      <div class="resume-sections">
        <!-- اطلاعات شخصی -->
        <div v-if="profileData.resume.personal_info" class="section">
          <h2 class="section-title">
            <i class="fas fa-user"></i>
            اطلاعات شخصی
          </h2>
          <div class="section-content info-grid">
            <div class="info-item">
              <span class="info-label">جنسیت:</span>
              <span class="info-value">{{ gender[profileData.resume.personal_info.gender] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">وضعیت تاهل:</span>
              <span class="info-value">{{
                maritalStatus[profileData.resume.personal_info.is_married]
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">وضعیت نظام وظیفه:</span>
              <span class="info-value">{{
                militaryServiceStatus[profileData.resume.personal_info.military_service_status]
              }}</span>
            </div>
            <div v-if="profileData.resume.personal_info.about_me" class="info-item full-width">
              <span class="info-label">درباره من:</span>
              <p class="info-value">{{ profileData.resume.personal_info.about_me }}</p>
            </div>
          </div>
        </div>

        <!-- اطلاعات تماس -->
        <div v-if="profileData.resume.contact_info" class="section">
          <h2 class="section-title">
            <i class="fas fa-address-card"></i>
            اطلاعات تماس
          </h2>
          <div class="section-content info-grid">
            <div class="info-item">
              <span class="info-label">تلفن همراه:</span>
              <span class="info-value">{{ profileData.resume.contact_info.phone_number }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ایمیل:</span>
              <span class="info-value">{{ profileData.resume.contact_info.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">تلفن ثابت:</span>
              <span class="info-value">{{ profileData.resume.contact_info.landline }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">وب‌سایت:</span>
              <span class="info-value">{{ profileData.resume.contact_info.website }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">آدرس:</span>
              <span class="info-value">
                {{
                  `${profileData.resume.contact_info.country}، ${profileData.resume.contact_info.province}، ${profileData.resume.contact_info.city}، ${profileData.resume.contact_info.address}`
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- تحصیلات -->
        <div v-if="profileData.resume.education?.length > 0" class="section">
          <h2 class="section-title">
            <i class="fas fa-graduation-cap"></i>
            تحصیلات
          </h2>
          <div class="section-content">
            <div v-for="edu in profileData.resume.education" :key="edu.id" class="timeline-item">
              <div class="timeline-header">
                <h3>{{ educationDegree[edu.degree] }} {{ edu.major }}</h3>
                <span class="timeline-period">
                  {{ universityType[edu.university_type] }} - {{ edu.university_name }}
                </span>
              </div>
              <div class="timeline-details">
                <span class="detail-tag">معدل: {{ edu.grade }}</span>
                <span class="detail-tag">
                  {{ edu.entrance_year }} -
                  {{ edu.is_current ? 'در حال تحصیل' : edu.graduation_year }}
                </span>
                <span class="detail-tag">
                  {{ `${edu.country}، ${edu.province}، ${edu.city}` }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- تجربیات کاری -->
        <div v-if="profileData.resume.work_experiences?.length > 0" class="section">
          <h2 class="section-title">
            <i class="fas fa-briefcase"></i>
            تجربیات کاری
          </h2>
          <div class="section-content">
            <div
              v-for="exp in profileData.resume.work_experiences"
              :key="exp.id"
              class="timeline-item"
            >
              <div class="timeline-header">
                <h3>{{ exp.position }}</h3>
                <span class="timeline-period">{{ exp.company_name }}</span>
              </div>
              <div class="timeline-details">
                <span class="detail-tag">
                  {{ exp.start_date }} -
                  {{ exp.is_current ? 'تاکنون' : exp.end_date }}
                </span>
                <span class="detail-tag">
                  {{ `${exp.country}، ${exp.province}، ${exp.city}` }}
                </span>
              </div>
              <p v-if="exp.description" class="timeline-description">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <!-- زبان‌ها -->
        <div v-if="profileData.resume.languages?.length > 0" class="section">
          <h2 class="section-title">
            <i class="fas fa-language"></i>
            زبان‌ها
          </h2>
          <div class="section-content skills-grid">
            <div v-for="lang in profileData.resume.languages" :key="lang.id" class="skill-item">
              <span class="skill-name">{{ lang.name }}</span>
              <span class="skill-level">{{ proficiencyLevel[lang.proficiency] }}</span>
            </div>
          </div>
        </div>

        <!-- مهارت‌ها -->
        <div v-if="profileData.resume.skills?.length > 0" class="section">
          <h2 class="section-title">
            <i class="fas fa-code"></i>
            مهارت‌ها
          </h2>
          <div class="section-content skills-grid">
            <div v-for="skill in profileData.resume.skills" :key="skill.id" class="skill-item">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ proficiencyLevel[skill.proficiency] }}</span>
            </div>
          </div>
        </div>

        <!-- گواهینامه‌ها -->
        <div v-if="profileData.resume.certificates?.length > 0" class="section">
          <h2 class="section-title">
            <i class="fas fa-certificate"></i>
            گواهینامه‌ها
          </h2>
          <div class="section-content">
            <div
              v-for="cert in profileData.resume.certificates"
              :key="cert.id"
              class="timeline-item"
            >
              <div class="timeline-header">
                <h3>{{ cert.title }}</h3>
                <span class="timeline-period">{{ cert.institute }}</span>
              </div>
              <div class="timeline-details">
                <span v-if="cert.date" class="detail-tag">{{ cert.date }}</span>
                <a v-if="cert.link" :href="cert.link" target="_blank" class="detail-link">
                  <i class="fas fa-external-link-alt"></i>
                  مشاهده گواهی
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: space(4);
  background-color: color(surface);
  min-height: 100vh;
}

.error-message {
  text-align: center;
  color: color(error);
  padding: space(4);
  @include typography(lg);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: space(4);
  margin-bottom: space(6);
  padding: space(4);
  background-color: color(surface-variant);
  border-radius: radius(xl);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @include breakpoint(sm) {
    flex-direction: column;
    text-align: center;
  }
}

.profile-picture-container {
  flex-shrink: 0;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid color(primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.profile-info {
  flex-grow: 1;
}

.user-name {
  @include typography('2xl', bold);
  color: color(on-surface);
  margin-bottom: space(2);
}

.user-details {
  display: flex;
  gap: space(4);
  color: color(on-surface-variant);
  @include typography(md);

  @include breakpoint(sm) {
    justify-content: center;
    flex-wrap: wrap;
  }
}

.detail-item {
  display: flex;
  align-items: center;
  gap: space(2);

  i {
    color: color(primary);
  }
}

.resume-sections {
  display: grid;
  gap: space(4);
}

.section {
  background-color: color(surface);
  border-radius: radius(lg);
  padding: space(4);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid color(outline);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.section-title {
  @include typography(xl, bold);
  color: color(primary);
  margin-bottom: space(4);
  display: flex;
  align-items: center;
  gap: space(2);

  i {
    width: 24px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: space(3);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: space(1);

  &.full-width {
    grid-column: 1 / -1;
  }
}

.info-label {
  @include typography(sm);
  color: color(on-surface-variant);
}

.info-value {
  @include typography(md);
  color: color(on-surface);
}

.timeline-item {
  padding-bottom: space(4);
  border-bottom: 1px solid color(outline);
  margin-bottom: space(4);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: space(2);
  gap: space(2);

  @include breakpoint(sm) {
    flex-direction: column;
  }

  h3 {
    @include typography(lg, bold);
    color: color(on-surface);
    margin: 0;
  }
}

.timeline-details {
  display: flex;
  flex-wrap: wrap;
  gap: space(2);
  margin-bottom: space(2);
}

.detail-tag {
  background-color: color(surface-variant);
  color: color(on-surface-variant);
  padding: space(1) space(2);
  border-radius: radius(sm);
  @include typography(sm);
}

.detail-link {
  color: color(primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: space(1);
  @include typography(sm);

  &:hover {
    text-decoration: underline;
  }
}

.timeline-period {
  color: color(primary);
  @include typography(sm);
  white-space: nowrap;
}

.timeline-description {
  color: color(on-surface-variant);
  @include typography(md);
  margin: 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: space(3);
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: space(2) space(3);
  background-color: color(surface-variant);
  border-radius: radius(md);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.skill-name {
  @include typography(md, bold);
  color: color(on-surface);
}

.skill-level {
  @include typography(sm);
  color: color(primary);
  background-color: color(primary-container);
  padding: space(1) space(2);
  border-radius: radius(sm);
}
</style>
