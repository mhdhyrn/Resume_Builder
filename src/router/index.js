import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from '@/constants/router';

const routes = [
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
        path: authRoutes.SIGNUP_PATH,
        name: authRoutes.SIGNUP_NAME,
        component: authRoutes.SIGNUP_COMPONENT,
        meta: authRoutes.SIGNUP_META,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
