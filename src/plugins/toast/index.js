import Toast from './toast.helper.js';
export { default as ToastContainer } from '@/components/ToastContainer.component.vue';

export const notify = new Toast().showToast;
export default Toast;
