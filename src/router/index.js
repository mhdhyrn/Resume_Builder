import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes, homeRoutes, resumeRoutes } from '@/constants/router';
import { modalStore } from '@/stores';

const routes = [
  // home
  {
    path: homeRoutes.HOME_PATH,
    name: homeRoutes.HOME_NAME,
    component: homeRoutes.HOME_COMPONENT,
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = modalStore();
  const isAuthRequired = to.meta.isAuthRequired === true;
  const hasToken = !!sessionStorage.getItem('access_token');

  if (isAuthRequired && !hasToken) {
    store.openAuthModal();
    next(false);
    return;
  }

  next();
});

export default router;
