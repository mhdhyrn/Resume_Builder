const routes = Object.freeze({
  ROOT_NAME: 'Auth',
  ROOT_PATH: '/auth',

  LOGIN_NAME: 'Login',
  LOGIN_PATH: 'login',
  LOGIN_COMPONENT: () => import('@/views/auth/Login.view.vue'),
  LOGIN_META: { layout: 'auth' },

  OTP_NAME: 'OTP',
  OTP_PATH: 'otp',
  OTP_COMPONENT: () => import('@/views/auth/OTP.view.vue'),
  OTP_META: { layout: 'auth' },
});

export default routes;
