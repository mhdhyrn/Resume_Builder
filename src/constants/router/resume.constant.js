const routes = Object.freeze({
  ROOT_NAME: 'Resume',
  ROOT_PATH: '/resume',
  ROOT_META: { isAuthRequired: true },

  TEMPLATES_NAME: 'ResumeTemplates',
  TEMPLATES_PATH: 'templates',
  TEMPLATES_COMPONENT: () => import('@/views/resume/templates.view.vue'),
  TEMPLATE_META: { isAuthRequired: true },

  STEPS_NAME: 'ResumeForms',
  STEPS_PATH: 'templates/:templateId',
  STEPS_COMPONENT: () => import('@/views/resume/forms.view.vue'),
  STEPS_META: { isAuthRequired: true },
});

export default routes;
