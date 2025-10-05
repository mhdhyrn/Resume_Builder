import { createRouter, createWebHistory } from 'vue-router';
import {
  authRoutes,
  homeRoutes,
  resumeRoutes,
  adminRoutes,
  walletRoutes,
} from '@/constants/router';
import { modalStore } from '@/stores';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
  // home
  {
    path: homeRoutes.HOME_PATH,
    name: homeRoutes.HOME_NAME,
    component: homeRoutes.HOME_COMPONENT,
  },
  // wallet
  {
    path: walletRoutes.ROOT_PATH,
    name: walletRoutes.ROOT_NAME,
    component: walletRoutes.BALANCE_COMPONENT,
    meta: walletRoutes.BALANCE_META,
  },
  // auth
  {
    path: authRoutes.ROOT_PATH,
    name: authRoutes.ROOT_NAME,
    redirect: { name: authRoutes.LOGIN_NAME },
    children: [
      {
        path: authRoutes.LOGIN_PATH,
        name: authRoutes.LOGIN_NAME,
        component: authRoutes.LOGIN_COMPONENT,
        meta: authRoutes.LOGIN_META,
      },
      {
        path: authRoutes.OTP_PATH,
        name: authRoutes.OTP_NAME,
        component: authRoutes.OTP_COMPONENT,
        meta: authRoutes.OTP_META,
      },
      {
        path: authRoutes.PROFILE_COMPLETION_PATH,
        name: authRoutes.PROFILE_COMPLETION_NAME,
        component: authRoutes.PROFILE_COMPLETION_COMPONENT,
        meta: authRoutes.PROFILE_COMPLETION_META,
      },
    ],
  },
  // resume
  {
    path: resumeRoutes.ROOT_PATH,
    name: resumeRoutes.ROOT_NAME,
    redirect: { name: resumeRoutes.TEMPLATES_NAME },
    meta: resumeRoutes.ROOT_META,
    children: [
      {
        path: resumeRoutes.TEMPLATES_PATH,
        name: resumeRoutes.TEMPLATES_NAME,
        component: resumeRoutes.TEMPLATES_COMPONENT,
        redirect: {
          name: resumeRoutes.STEPS_NAME,
          params: { templateId: 1 },
          query: { step: 'personalInformation' },
        },
        meta: resumeRoutes.TEMPLATE_META,
      },
      {
        path: resumeRoutes.STEPS_PATH,
        name: resumeRoutes.STEPS_NAME,
        component: resumeRoutes.STEPS_COMPONENT,
        meta: resumeRoutes.STEPS_META,
      },
      {
        path: resumeRoutes.HISTORY_PATH,
        name: resumeRoutes.HISTORY_NAME,
        component: resumeRoutes.HISTORY_COMPONENT,
        meta: resumeRoutes.HISTORY_META,
      },
    ],
  },
  // admin login (no layout)
  {
    path: `${adminRoutes.ROOT_PATH}/${adminRoutes.LOGIN_PATH}`,
    name: adminRoutes.LOGIN_NAME,
    component: adminRoutes.LOGIN_COMPONENT,
    meta: adminRoutes.LOGIN_META,
  },
  // admin with layout
  {
    path: adminRoutes.ROOT_PATH,
    name: adminRoutes.ROOT_NAME,
    redirect: { name: adminRoutes.DASHBOARD_NAME },
    meta: adminRoutes.ROOT_META,
    children: [
      {
        path: adminRoutes.DASHBOARD_PATH,
        name: adminRoutes.DASHBOARD_NAME,
        component: adminRoutes.DASHBOARD_COMPONENT,
        meta: adminRoutes.DASHBOARD_META,
      },
      {
        path: adminRoutes.PAYMENT_REQUESTS_PATH,
        name: adminRoutes.PAYMENT_REQUESTS_NAME,
        component: adminRoutes.PAYMENT_REQUESTS_COMPONENT,
        meta: adminRoutes.PAYMENT_REQUESTS_META,
      },
      {
        path: adminRoutes.TEMPLATES_PATH,
        name: adminRoutes.TEMPLATES_NAME,
        component: adminRoutes.TEMPLATES_COMPONENT,
        meta: adminRoutes.TEMPLATES_META,
      },
      {
        path: adminRoutes.TEMPLATE_EDIT_PATH,
        name: adminRoutes.TEMPLATE_EDIT_NAME,
        component: adminRoutes.TEMPLATE_EDIT_COMPONENT,
        meta: adminRoutes.TEMPLATE_EDIT_META,
      },
    ],
  },
  {
    path: '/resume/profile/:userId',
    name: 'Profile',
    component: () => import('@/views/Profile.view.vue'),
    // meta: {
    //   isAuthRequired: true,
    // },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let profileModalShown = false;

router.beforeEach((to, from, next) => {
  const store = modalStore();
  const isAuthRequired = to.meta.isAuthRequired === true;
  const isAdminRequired = to.meta.isAdminRequired === true;
  const hasToken = !!sessionStorage.getItem('access_token');
  const isAdmin = sessionStorage.getItem('is_admin') === 'true';

  if (isAdminRequired) {
    if (!isAdmin) {
      next({ name: adminRoutes.LOGIN_NAME });
      return;
    }
  }

  if (isAuthRequired && !hasToken) {
    store.openAuthModal();
    next(false);
    return;
  }

  // Only check for profile completion if user is logged in
  if (hasToken) {
    const authStore = useAuthStore();
    const info = authStore.userInfo;
    const isProfileIncomplete =
      !info.firstName || !info.lastName || !info.birthDate || !info.profilePicture;
    const isOnProfileCompletion = to.name === authRoutes.PROFILE_COMPLETION_NAME;
    const isOnPublicProfile = to.name === 'Profile';
    if (
      isProfileIncomplete &&
      !isOnProfileCompletion &&
      !isOnPublicProfile &&
      to.name !== authRoutes.LOGIN_NAME &&
      to.name !== authRoutes.OTP_NAME
    ) {
      if (!profileModalShown) {
        store.openProfileModal();
        profileModalShown = true;
      }
    }
  }

  next();
});

export default router;
