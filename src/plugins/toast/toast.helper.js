import { reactive, ref } from 'vue';

class Toast {
  static toasts = reactive([]);
  static isHover = ref();
  constructor() {
    if (!Toast.instance) {
      Toast.instance = this;
    }
    return Toast.instance;
  }

  showToast({ message, duration = 3000, ...props }) {
    if (Toast.toasts.length >= 1) return;

    const newToast = {
      message,
      duration,
      id: `id-${Date.now().toString(36)} - ${Math.random().toString(36).substring(2, 9)}`,
      ...props,
    };
    Toast.toasts.push(newToast);

    let timer = 0;

    const interval = setInterval(() => {
      if (!Toast.isHover.value) timer += 500;

      if (duration === timer) {
        Toast.toasts.splice(0, 1);
        clearInterval(interval);
      }
    }, 500);
  }

  hideToast(toastId) {
    const toastIndex = Toast.toasts.findIndex((toast) => toast.id === toastId);
    if (toastIndex === -1) return;

    Toast.toasts.splice(toastIndex, 1);
  }
}

export default Toast;
