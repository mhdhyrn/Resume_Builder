import Vue3Toastify from 'vue3-toastify';

const TOAST_CONFIG = {
  theme: 'colored',
  position: 'bottom-right',
  rtl: true,
  transition: 'slide',
  dangerouslyHTMLString: true,
  pauseOnFocusLoss: false,
  toastClassName: 'toast-custom-class',
  containerClassName: 'toast-container-custom-class',
  expandCustomProps: true,
  icon: false,
  closeButton: false,
  hideProgressBar: true,
};

export default {
  name: 'toast',
  parallel: true,
  async setup(app) {
    await import('vue3-toastify/dist/index.css');

    app.use(Vue3Toastify, TOAST_CONFIG);
  },
};
