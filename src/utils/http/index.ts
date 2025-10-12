import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer
} from "axios";

import {
  getCurrentUser,
  silentRenew,
  setupSilentRenewMessageListener as _setupSilentRenewMessageListener
} from "@/utils/oidc";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";

// 获取CSRF令牌的函数
function getCsrfToken(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([\w-]+)/);
  return match ? match[1] : null;
}

// 初始化时获取CSRF令牌
async function initializeCsrfToken(httpInstance: PureHttp) {
  try {
    // 尝试从API配置端点获取CSRF令牌
    await httpInstance.get("/api/abp/application-configuration");
  } catch (error) {
    console.warn("Failed to initialize CSRF token:", error);
    // 不再阻止应用初始化，只是记录警告
  }
}

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    // 初始化时设置消息监听器
    _setupSilentRenewMessageListener();
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** `token`过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新`token` */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }

        /** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
        const whiteList = [
          "/connect/authorize",
          "/connect/token",
          "/connect/userinfo",
          "/login"
        ];
        return whiteList.some(url => config.url.endsWith(url))
          ? config
          : new Promise(async resolve => {
              const user = await getCurrentUser();
              if (user && !user.expired) {
                config.headers["Authorization"] = `Bearer ${user.access_token}`;
                resolve(config);
              } else if (user && user.expired) {
                if (!PureHttp.isRefreshing) {
                  PureHttp.isRefreshing = true;
                  try {
                    console.log("令牌已过期，尝试静默刷新");
                    const renewedUser = await silentRenew();
                    if (renewedUser) {
                      console.log("静默刷新成功，更新令牌");
                      config.headers["Authorization"] =
                        `Bearer ${renewedUser.access_token}`;
                      PureHttp.requests.forEach(cb =>
                        cb(renewedUser.access_token)
                      );
                      PureHttp.requests = [];
                    } else {
                      // 静默刷新返回null，可能需要重新登录
                      console.warn("静默刷新返回空用户，可能需要重新登录");
                      // 清除本地存储的用户信息
                      localStorage.removeItem("oidc_user");
                      // 不直接重定向，让请求继续并返回401，由具体页面处理
                    }
                  } catch (error) {
                    console.error("Token 刷新失败:", error);
                    // 刷新失败，清除 token 但不直接重定向，让具体页面处理
                    localStorage.removeItem("oidc_user");
                  } finally {
                    PureHttp.isRefreshing = false;
                  }
                }
                resolve(PureHttp.retryOriginalRequest(config));
              } else {
                // 未认证，重定向到登录（但对于 API 请求，可能返回 401）
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 添加CSRF令牌到请求头
    if (config.method && config.method.toLowerCase() !== "get") {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers = config.headers || {};
        config.headers["RequestVerificationToken"] = csrfToken;
      }
    }

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }
}

export const http = new PureHttp();

// 初始化CSRF令牌
initializeCsrfToken(http);
