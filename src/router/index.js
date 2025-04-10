import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes, homeRoutes } from '@/constants/router';

const routes = [
  {
    path: homeRoutes.HOME_PATH,
    name: homeRoutes.HOME_NAME,
    component: homeRoutes.HOME_COMPONENT,
  },
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
