const routes = Object.freeze({
  ROOT_NAME: 'Auth',
  ROOT_PATH: '/auth',

  LOGIN_NAME: 'Login',
  LOGIN_PATH: 'login',
  LOGIN_COMPONENT: () => import('@/views/auth/Login.view.vue'),
  LOGIN_META: { layout: 'auth' },

  SIGNUP_NAME: 'Signup',
  SIGNUP_PATH: 'signup',
  SIGNUP_COMPONENT: () => import('@/views/auth/Signup.view.vue'),
  SIGNUP_META: { layout: 'auth' },
});

export default routes;
