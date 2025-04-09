import CustomToastComponent from '@/components/shared/custom-toast.component.vue';
import { toast } from 'vue3-toastify';

const toastTypes = ['info', 'error', 'warning', 'success', 'loading', 'dark'];

const defaultOptions = {
  autoClose: 3000,
};

const renderCustomToastComponent = (content, options = {}, type) => {
  console.log(type);

  if (!toastTypes.includes(type)) {
    throw new Error(
      `Unsupported toast type: "${type}". Supported types are: ${toastTypes.join(', ')}`,
    );
  }

  return toast[type](
    h(CustomToastComponent, {
      content,
      ...defaultOptions,
      ...options,
      type,
    }),
    {
      ...defaultOptions,
      ...options,
    },
  );
};

const ToastService = toastTypes.reduce((service, type) => {
  service[type] = (content, options) => renderCustomToastComponent(content, options, type);
  return service;
}, {});

export default ToastService;
