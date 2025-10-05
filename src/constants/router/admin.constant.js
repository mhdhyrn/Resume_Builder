const routes = Object.freeze({
  ROOT_NAME: 'Admin',
  ROOT_PATH: '/admin',
  ROOT_META: { isAdminRequired: true, layout: 'Admin' },

  LOGIN_NAME: 'AdminLogin',
  LOGIN_PATH: 'login',
  LOGIN_COMPONENT: () => import('@/views/admin/Login.view.vue'),
  LOGIN_META: { isAdminRequired: false, layout: 'auth' },

  DASHBOARD_NAME: 'AdminDashboard',
  DASHBOARD_PATH: '',
  DASHBOARD_COMPONENT: () => import('@/views/admin/Dashboard.view.vue'),
  DASHBOARD_META: { isAdminRequired: true, layout: 'Admin' },

  PAYMENT_REQUESTS_NAME: 'AdminPaymentRequests',
  PAYMENT_REQUESTS_PATH: 'payment-requests',
  PAYMENT_REQUESTS_COMPONENT: () => import('@/views/admin/PaymentRequests.view.vue'),
  PAYMENT_REQUESTS_META: { isAdminRequired: true, layout: 'Admin' },

  TEMPLATES_NAME: 'AdminTemplates',
  TEMPLATES_PATH: 'templates',
  TEMPLATES_COMPONENT: () => import('@/views/admin/Templates.view.vue'),
  TEMPLATES_META: { isAdminRequired: true, layout: 'Admin' },

  TEMPLATE_EDIT_NAME: 'AdminTemplateEdit',
  TEMPLATE_EDIT_PATH: 'templates/:id/edit',
  TEMPLATE_EDIT_COMPONENT: () => import('@/views/admin/TemplateEdit.view.vue'),
  TEMPLATE_EDIT_META: { isAdminRequired: true, layout: 'Admin' },
});

export default routes;
