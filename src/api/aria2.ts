import { http } from "@/utils/http";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type { TellStatusResultDto } from "../types/business";

class Aria2Api {
  private baseUrl = "/api/app/aria2";

  /**
   * 获取下载状态列表
   */
  async getAria2Status(
    params?: PagedRequestDto & { filter?: string }
  ): Promise<PagedResultDto<TellStatusResultDto>> {
    return http.get(this.baseUrl, { params });
  }

  /**
   * 获取单个外部链接
   */
  async getExternalLink(id: number): Promise<string> {
    return http.get(`${this.baseUrl}/${id}/external-link`);
  }

  /**
   * 获取所有外部链接
   */
  async getAllExternalLinks(): Promise<string[]> {
    return http.get(`${this.baseUrl}/external-links`);
  }

  /**
   * 删除单个记录
   */
  async delete(id: number): Promise<void> {
    return this.request("delete", `${this.baseUrl}/${id}`);
  }

  /**
   * 删除所有记录
   */
  async deleteAll(): Promise<void> {
    return this.request("delete", `${this.baseUrl}/all`);
  }

  /**
   * 通用请求方法
   */
  private request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any
  ): Promise<T> {
    if (method === "get") {
      return http.get<T, any>(url, { params: data });
    } else {
      return http.post<T, any>(url, { data });
    }
  }
}

// 导出单例实例
export const aria2Api = new Aria2Api();

// 导出用于 Composition API 的 hook
export function useAria2Api() {
  return aria2Api;
}

export default aria2Api;
