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
    const response = await this.http.request<any>(config);

    // 兼容两种后端返回：
    // 1. 统一包装的 ApiResponse<T> -> { success: boolean, data: T }
    // 2. 直接返回数据 T（例如直接返回 PagedResultDto）
    const respData = response.data;

    if (respData && typeof respData === "object") {
      // 情况 1：符合 ApiResponse 结构，且有 data 字段
      if (Object.prototype.hasOwnProperty.call(respData, "success")) {
        // 如果 success 为 false，抛出业务错误
        if (respData.success === false) {
          throw new Error(respData.error?.message || "请求失败");
        }

        // 返回 data（可能为 undefined）
        return respData.data as T;
      }

      // 情况 2：直接返回数据（未包装），直接返回该对象
      return respData as T;
    }

    // 如果没有任何数据，抛出错误以便上层捕获并记录
    throw new Error("服务器返回空响应");
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
