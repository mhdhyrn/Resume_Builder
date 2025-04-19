import axios from '../index';
import { notify } from '@/plugins/toast';

const retryStrategies = {
  exponential: (currentRetry, coefficient) => Math.pow(2, currentRetry) * coefficient,
  logarithm: (currentRetry, coefficient) => Math.log2(currentRetry + 1) * coefficient,
  linear: (currentRetry, coefficient) => coefficient,
  custom: (currentRetry, coefficient, delayFunction) => delayFunction(currentRetry, coefficient),
};

class ResponseHandler {
  static handle(response) {
    const statusCode = response?.status;
    const message = response?.data?.data?.message?.fa;
    const isShowNotify = response.config?.showToast;

    if (isShowNotify && message) {
      toast.success(message);
    }

    return {
      success: true,
      status: response.status,
      data: response?.data,
      statusText: response.statusText,
    };
  }
}

class ErrorHandler {
  static handle(error) {
    const errorStatusCode = error.response?.status;
    const errorMetaCode = error.response?.data?.meta?.code;
    const errorMessage = error.response?.data?.data?.message?.fa;
    const additionalInfos = error?.response?.data?.data?.additionalInfo;
    const isShowNotify = error.config?.showToast ?? true;
    const hasRetry = error.config?.retry;

    ErrorHandler.checkInvalidToken(errorMetaCode);

    if (isShowNotify) {
      if (error.config?.showErrorDetails) {
        additionalInfos?.forEach(({ message, path }) => {
          notify({ message, type: 'error' });
        });
      } else {
        notify({ message, type: 'error' });
      }
    }

    if (hasRetry) {
      return ErrorHandler.handleRetry(error);
    }

    return Promise.reject({
      success: false,
      rateLimit: {
        duration: 0,
        isBlocked: false,
      },
      status: error.response?.status,
      meta: error.response?.data?.meta,
      data: error.response?.data?.data,
      statusText: error.response?.statusText,
    });
  }

  static checkInvalidToken(errorCode) {
    const errorMetaCode = ['invalidToken'];

    if (!errorMetaCode.includes(errorCode)) return;

    toast.error('درخواست شما منقضی شده است.');
    sessionStorage.clear('access_token');
  }

  static handleRetry(error) {
    const retryConfig = error.config.retry || {};
    const {
      count = 5,
      mode = 'exponential',
      coefficient = 1,
      currentRetry = 1,
      delayFunction = (currentRetry, coefficient) => currentRetry * coefficient,
    } = retryConfig;

    if (typeof count !== 'number' || count <= 0) {
      return Promise.reject(error);
    }

    if (currentRetry < count) {
      const strategy = retryStrategies[mode] || retryStrategies.exponential;
      const delay = strategy(currentRetry, coefficient, delayFunction);

      console.info(`Retry attempt ${currentRetry} of ${count}. Retrying after ${delay} seconds.`);

      const updatedConfig = {
        ...error.config,
        retry: {
          count,
          mode,
          coefficient,
          currentRetry: currentRetry + 1,
        },
      };

      return new Promise((resolve) =>
        setTimeout(() => resolve(axios.request(updatedConfig)), delay * 1000),
      );
    }

    return Promise.reject(error);
  }
}

const interceptorFactory = {
  onFulfilled: (response) => Promise.resolve(ResponseHandler.handle(response)),
  onRejected: (error) => ErrorHandler.handle(error),
};

export default interceptorFactory;
