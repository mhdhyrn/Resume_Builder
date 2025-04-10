import AxiosBuilder from './axiosBuilder';
import request from './interceptors/request.interceptor';
import response from './interceptors/response.interceptor';

const axiosInstance = new AxiosBuilder()
  .addRequestInterceptor(request.onFulfilled, request.onRejected)
  .addResponseInterceptor(response.onFulfilled, response.onRejected)
  .build();

export default axiosInstance;
