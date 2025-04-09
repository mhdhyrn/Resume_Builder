import axios from 'axios';

class AxiosBuilder {
  constructor() {
    this.instance = axios.create({
      timeout: 3 * 60 * 1000,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    this.instance.defaults.showToast = true;
    this.instance.defaults.retry = false;
  }

  setTimeout(milliseconds) {
    this.instance.defaults.timeout = milliseconds;
    return this;
  }

  enableRetry(retryConfig = false) {
    this.instance.defaults.retry = retryConfig;
    return this;
  }

  enableToast(showToast = true) {
    this.instance.defaults.showToast = showToast;
    return this;
  }

  setHeaders(headers) {
    this.instance.defaults.headers = { ...this.instance.defaults.headers, ...headers };
    return this;
  }

  addRequestInterceptor(onFulfilled, onRejected) {
    this.instance.interceptors.request.use(onFulfilled, onRejected);
    return this;
  }

  addResponseInterceptor(onFulfilled, onRejected) {
    this.instance.interceptors.response.use(onFulfilled, onRejected);
    return this;
  }

  build() {
    return this.instance;
  }
}

export default AxiosBuilder;
