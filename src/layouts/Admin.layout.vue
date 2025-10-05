<script setup>
import { useRouter, useRoute } from 'vue-router';
import { adminRoutes } from '@/constants/router';

const router = useRouter();
const route = useRoute();

const isActive = (name) => route.name === name;
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-title">مدیریت</div>
      <ul class="sidebar-menu">
        <li>
          <button
            class="link"
            :class="{ active: isActive(adminRoutes.DASHBOARD_NAME) }"
            @click="() => router.push({ name: adminRoutes.DASHBOARD_NAME })"
          >
            داشبورد
          </button>
        </li>
        <li>
          <button
            class="link"
            :class="{ active: isActive(adminRoutes.PAYMENT_REQUESTS_NAME) }"
            @click="() => router.push({ name: adminRoutes.PAYMENT_REQUESTS_NAME })"
          >
            درخواست‌های افزایش کیف پول
          </button>
        </li>
        <li>
          <button
            class="link"
            :class="{ active: isActive(adminRoutes.TEMPLATES_NAME) }"
            @click="() => router.push({ name: adminRoutes.TEMPLATES_NAME })"
          >
            مدیریت تمپلیت‌ها
          </button>
        </li>
      </ul>
    </aside>

    <section class="admin-content">
      <slot :key="$route.path" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  gap: 16px;
}

.admin-sidebar {
  width: 260px;
  background: color(surface);
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 16px;
}

.sidebar-title {
  color: color(on-surface);
  font-weight: 600;
  margin-bottom: 12px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link {
  background: transparent;
  border: none;
  color: color(primary);
  text-align: right;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: radius(md);
  transition: background 0.2s ease;

  &:hover {
    background: color(primary-container);
  }

  &.active {
    color: color(on-primary-container);
    background: color(primary-container);
  }
}

.admin-content {
  flex: 1;
  background: color(surface);
  border: 1px solid color(outline);
  border-radius: radius(lg);
  padding: 24px;
  color: color(on-surface);
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
  }
}
</style>
