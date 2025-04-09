import AxiosBuilder from "./axiosBuilder";
import request from "@shared/services/axios/interceptors/request.interceptor.js";
import response from "@shared/services/axios/interceptors/response.interceptor.js";

const axiosInstance = new AxiosBuilder()
  .addRequestInterceptor(request.onFulfilled, request.onRejected)
  .addResponseInterceptor(response.onFulfilled, response.onRejected)
  .build();

export default axiosInstance;
