import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from "axios";
import type { ApiResponse } from "../types/api";
import { getToken } from "../utils/auth"; // 假设 auth.ts 有 getToken 方法

// API 基础服务类
export class ApiService {
  protected baseURL: string;
  protected http: AxiosInstance;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    // 请求拦截器：添加认证 token
    this.http.interceptors.request.use(
      config => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器：统一错误处理
    this.http.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        const { data } = response;
        if (data.success === false) {
          // 处理业务错误
          throw new Error(data.error?.message || "请求失败");
        }
        return response;
      },
      error => {
        // 处理 HTTP 错误
        if (error.response?.status === 401) {
          // Token 过期，跳转登录
          window.location.href = "/login";
        } else if (error.response?.status >= 400) {
          throw new Error(
            error.response?.data?.error?.message || error.message
          );
        }
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.http.request<ApiResponse<T>>(config);
    return response.data.data!;
  }

  // GET 请求
  protected async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const merged: AxiosRequestConfig = {
      url,
      method: "get",
      params,
      ...config
    };
    return this.request<T>(merged);
  }

  // POST 请求
  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const merged: AxiosRequestConfig = { url, method: "post", data, ...config };
    return this.request<T>(merged);
  }

  // PUT 请求
  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const merged: AxiosRequestConfig = { url, method: "put", data, ...config };
    return this.request<T>(merged);
  }

  // DELETE 请求
  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const merged: AxiosRequestConfig = { url, method: "delete", ...config };
    return this.request<T>(merged);
  }
}

// 导出实例或子类使用
export default ApiService;
